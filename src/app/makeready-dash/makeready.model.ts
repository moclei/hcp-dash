import * as firebase from 'firebase';
import FieldValue = firebase.firestore.FieldValue;
import Timestamp = firebase.firestore.Timestamp;

export class MakeReady {
  timestamp: string;
  email: string;
  propertyName: string;
  preparerName: string;
  unit: Unit;
  scope: Scope;
  contracts: Contract[];
  checklist?: Checklist;
  updatedAt?: FieldValue;
  createdAt?: FieldValue;
  removedReason?: string;
  removedAt?: FieldValue;
  removed?: boolean;
  moveOutDate?: Timestamp;

  constructor(timestamp, email, propertyName, preparerName, unit) {
    this.timestamp = timestamp;
    this.email = email;
    this.propertyName = propertyName;
    this.preparerName = preparerName;
    this.unit = unit;
  }
  setScope(scope: Scope) {
    this.scope = scope;
  }
  setContracts(contracts: Contract[]) {
    this.contracts = contracts;
  }
  getAsJSON() {
    return JSON.parse(JSON.stringify(this));
  }
}

export interface MakeReadyId extends MakeReady {
  id: string;
}

export interface Contract {
  contractor: string;
  startDate: string;
  priceChoice: number;
  price: number;
  timeToComplete: string;
  poNumber: string;
  type: string;
  scope: string;
  quantity: number;
}

export interface Scope {
  scopeDescription: String;
  flooring: Flooring;
  appliances: boolean;
  applianceList: Array<string>;
  granite: boolean;
  graniteFinalPrice: number;
  graniteRate: number;
  showerTile: boolean;
  microwave: boolean;
  mrType: string;
  extras: Extras;
  totalPrice: number;
  costOfExtras: number;
  costOfUpgrades: number;
  basePrice: number;
  baseMReadyRate: number;
  finalRate: number;
  isFullTexture: boolean;
}

export interface Extras {
  switches: boolean;
  switchesQty: number;
  switchesPrice: number;
  ceilingFans: boolean;
  ceilingFansQty: number;
  ceilingFansPrice: number;
  blinds: boolean;
  blindsQty: number;
  blindsPrice: number;
  faucets: boolean;
  faucetsQty: number;
  faucetsPrice: number;
  lightFixtures: boolean;
  lightFixturesQty: number;
  lightFixturesPrice: number;
  tubReplace: boolean;
  tubReplacePrice: number;
  showerTileReplace: boolean;
  showerTilePrice: number;
  mirror: boolean;
  mirrorPrice: number;
  graniteBathroom: boolean;
  graniteKitchen: boolean;
  granitePickupPrice: number;
  granitePrepPrice: number;
  graniteRate: number;
  vanity: boolean;
  vanityPrice: number;
  kitchenSink: boolean;
  kitchenSinkPrice: number;
  microwave: boolean;
  microwavePrice: number;
  microwaveShelf: boolean;
  microwaveShelfPrice: number;
  interiorDoors: boolean;
  interiorDoorsQty: number;
  interiorDoorsJamb: boolean;
  interiorDoorsJambQty: number;
  interiorDoorsJambPrice: number;
  exteriorDoors: boolean;
  exteriorDoorsQty: number;
  exteriorDoorsPrice: number;
  exteriorDoorsJamb: boolean;
  exteriorDoorsJambQty: number;
  exteriorDoorsJambPrice: number;
  stove: boolean;
  fridge: boolean;
  dishwasher: boolean;
  mirrorDoors: boolean;
  mirrorDoorsQty: number;
  mirrorDoorsPrice: number;
  extrasAsArray: Array<any>;
  totalCost: number;
}

export interface Flooring {
  flooringNeeded: boolean;
  carpetReplace: boolean;
  carpetReplaceQty: boolean;
  carpetReplaceDescription: string;
  carpetShampoo: boolean;
  carpetShampooQty: number;
  carpetShampooDescription: string;
  installTile: boolean;
  installTileQty: number;
  installTileDescription: string;
  repairTile: boolean;
  repairTileQty: number;
  repairTileDescription: string;
  installPlank: boolean ;
  installPlankQty: number;
  installPlankDescription: string;
  repairPlank: boolean ;
  repairPlankQty: number ;
  repairPlankDescription: string ;
  plankingRate: number;
  carpetShampooRate: number;
  carpetReplaceRate: number;
  installTileRate: number;
  repairTileRate: number;
  repairTileFlatFee: number;
  flooringList: Array<{}>;
}
export interface Checklist {
    makeReadyRequested: boolean;
    materialsSubmitted: boolean;
    makeReadyApproved: boolean;
    materialsOrdered: boolean;
    contractorScheduled: boolean;
    contractorName: string;
    materialsDelivered: boolean;
    contractorStarted: boolean;
    contractorFinished: boolean;
    invoiceSubmitted: boolean;
    invoicePaid: boolean;
    makeReadyRequestedDate?: FieldValue;
    materialsSubmittedDate?: FieldValue;
    makeReadyApprovedDate?: FieldValue;
    materialsOrderedDate?: FieldValue;
    materialsDeliveredDate?: FieldValue;
    contractorScheduledDate?: FieldValue;
    contractorStartedDate?: FieldValue;
    contractorFinishedDate?: FieldValue;
    invoiceSubmittedDate?: FieldValue;
    invoicePaidDate?: FieldValue;
}
export interface Unit {
  unitName: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  floorplan: string;
  streetAddress: string;
  legalName: string;
  businessName: string;
  county: string;
  // unitName	Bedrooms	Bathrooms	Code	Size	streetAddress
}

