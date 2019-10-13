export interface FoodType {
  id: string;
  author: string;
  authorProfileUrl: string;
  isTags: string[];
  containsTags: string[];
  descriptiveTags: string[];
  originTitle: string;
  originUrl: string;
  title: string;
  license: string;
  licenseUrl: string;
}
export interface NeighborType {
  neighbors: string[];
}
export interface VectorType {
  dims: number[];
}
export interface FoodSpace extends VectorType, NeighborType {

}
export interface TagType extends NeighborType, VectorType {
  id: string;
  pretty: string;
}

