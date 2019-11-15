// import firebase from "../components/firebase";
import { firestore } from '../components/firebase'

export const INDEX_COLLECTION = "indexes"
export const FOOD_STATS_DOC_NAME = "foodspace"
export const TAG_STATS_DOC_NAME = "tagStats"
export const TAG_TO_FOOD_DOC_NAME = "tagFoods"

export const foodStats = firestore.collection(INDEX_COLLECTION).doc(FOOD_STATS_DOC_NAME);
export const tagStats = firestore.collection(INDEX_COLLECTION).doc(TAG_STATS_DOC_NAME);
export const tagFoodsIndex = firestore.collection(INDEX_COLLECTION).doc(TAG_TO_FOOD_DOC_NAME);