export interface FoodType {
  id: string;
  author: string;
  authorProfileUrl: string;
  isTags: string[];
  containsTags: string[];
  descriptiveTags: string[];
  allTags?: string[];
  originTitle: string;
  originUrl: string;
  title: string;
  license: string;
  licenseUrl: string;
  updated?: any;
  edited?: any;
}
export interface NeighborType {
  neighbors: string[];
}
export interface VectorType {
  dims: number[];
}
export interface FoodSpace extends VectorType, NeighborType {
  id: string;
}
export interface TagType extends NeighborType, VectorType {
  id: string;
  pretty: string;
}
export interface TagStat {
  id: string;
  containsTags: number;
  isTags: number;
  descriptiveTags: number;
  totalTags?: number;
  pretty: string;
  neighbors: string[];
  dims: number[];
}
export interface TagStats {
  [key: string]: TagStat
}
export interface FoodStat {
  id: string;
  neighbors: string[];
  dims: number[];
}
export interface FoodStats {
  [key: string]: FoodStat
}


