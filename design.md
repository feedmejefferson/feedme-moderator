# Firestore Quotas

The spark (free) tier of firebase gives us 50k free document reads per day before we hit a hard wall and have to wait until the next day. 

I may be doing some insane stuff here because I'm cheap, but it's not just a matter of being cheap in terms of money and plan utilization, it's also a matter of wanting to understand how best to be cheap in terms of network usage from the perspective of the app itself. 

## Home Grown Indexes

The first issue I hit was simply a matter of treating every tag as a document and then querying firestore for all of the documents in the tag collection just to get the list of tags. That single call actually got treated as 1k document reads rather than a single read. I updated the data model and stuffed all of the tags into a single document cutting our reads by a factor of 1k. 

There's no reason the document had to be limited to a list of tags though -- it's a json document meaning each tag could refer to a nested object of details. We could store all of the tag stats in here. This comes with certain advantages and disadvantages:

* Advantages
    * single read for all our tag details
* Disadvantages
    * size -- we really only need to load it once, but it takes a lot longer to load because it's a lot bigger in size
    * consistency -- how do we keep it up to date in real time when somebody removes a tag from a food? 


## What to put in Indexes?

We had a similar problem for foods, but the numbers were a little different. 

1. At the time we only had 270 or so foods (as opposed to 800 or so tags)
2. We only queried for all of the foods on the foods page and often with a tag filter, so we weren't returning all of the foods (we queried for the tags any time a page had a tag filter -- so both in the food editor every time somebody edited a tag, but also on the food filter page because it included the tag selector to filter foods by)

I mainly addressed this with pagination -- we limited the query to 20 foods at a time until the user scrolled down to see more. This cut the cost of each query by a factor of up to 10 (more if we had more foods).

In reality, we don't need all of the detail in the food document to display the food thumbnail -- we just need the id, because that's how we named the images (I'm starting to see why pexels embedded the start of the image description in the images url...)

We could use a similar home grown index to solve this problem though -- create a single document, read that document and filter it on the client side to get the list of images to display. 

That leads us to the question we started with here -- what to put in the index?

### Food / Tag inverted index

Each food is a list of tags. An inverted index would create the opposite mapping -- for each tag we would say which foods it was found in. 

#### Consistency

The problem with maintaining these indexes is that they'll quickly get out of date and rebuilding them offline is a bit of a pain. 

If we keep them simple though, firestore has some operations that may make updating them in realtime easy enough.

#### Immutability

The location of a food in the food space changes based on the tags it's been tagged with. The location of the tags on the other hand is relatively immuntable (until we build a completely new projection matrix). 

I've put off realtime calculations so far, but in theory we could pretty easily calculate the location of a food in the food space by averaging all of the tags locations (there's a little more to it than that, but not much).

So... The tag vectors are immutable, but the tag-food inverted index would not be. The food-tag index would be the main edit point (moderators add or remove tags from a food) and these operations would indirectly have the consequence of updating the food-vector and the tag-food inverted index. Updating the food description or any other details wouldn't have any other far reaching consequences (so far). 

### Refactoring

Should we combine the `foods` and `foodspace` collections? Is there any reason to maintain a foodspace collection at all? We could calculate it on demand... or we could maintain it a single "stats" index document. 

Should we maintain separate indexes for tag vectors and inverted tag-food lists?

#### Notes

It turns out I didn't have to do much to gather up all of the foodspace collection documents into a single file -- the output from R was already a single file that I had used some node.js magic to split into individual files. I'd already revamped a new CLI to convert the single json file from an array to an associative array rather than splitting it into individual files and I was using that to build the tagStats. Converting the foodspace into a similar type of file just meant using that new `associate` CLI command instead of the `split` command. 

As for the inverted index, I had to add a little bit of code to R, but not much. Then I had to run that through the same `assocate` command.