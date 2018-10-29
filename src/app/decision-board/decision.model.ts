import * as firebase from 'firebase';
import FieldValue = firebase.firestore.FieldValue;


/*
export class Decision {

  name: string;
  email: string;
  content: string;
  title: string;
  result: string;
  expectedValue: number;
  actualValue: number;
  private updatedAt: FieldValue;
  private createdAt: FieldValue;
  private totalRating: number;
  private numberOfRatings: number;
  private ratingScore: number;

  constructor(name, email, content?, title?, expectedValue?,
              actualValue?, totalRating?,  numberOfRatings?, ratingScore?) {
    this.name = name;
    this.email = email;
    this.content = content ? content : '';
    this.title = title ? title : '';
    this.expectedValue = expectedValue ? expectedValue : -1;
    this.actualValue = actualValue ? actualValue : -1;
    this.totalRating = totalRating ? totalRating : 0;
    this.numberOfRatings = numberOfRatings ? numberOfRatings : 0;
    this.ratingScore = ratingScore ? ratingScore : -1;
  }
  setRating(rating: number) {
    this.totalRating += rating;
    this.numberOfRatings++;
    this.ratingScore = this.totalRating / this.numberOfRatings;
  }
  setUpdatedAt(timestamp: FieldValue) {
    this.updatedAt = timestamp;
  }
  setCreatedAt(timestamp: FieldValue)  {
    this.createdAt = timestamp;
  }
}*/
export interface Decision {
  name: string;
  email: string;
  content: string;
  title: string;
  result: string;
  expectedValue: number;
  actualValue: number;
  updatedAt?: FieldValue;
  createdAt?: FieldValue;
  rating?: number;
  numberOfRatings?: number;
  ratingScore?: number;
  threeMonthResult?: string;
  sixMonthResult?: string;
}

/*
id
name
email
content
title
result
expectedValue
actualValue
updatedAt
createdAt
rating
numberOfRatings

userId
username
*/

export interface DecisionId extends Decision { id: string; }

