/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any };
};

/** Address */
export type AddressType = {
  __typename?: 'AddressType';
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  line1: Scalars['String']['output'];
  line2?: Maybe<Scalars['String']['output']>;
  postalCode: Scalars['String']['output'];
  state: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type AuthPayloadType = {
  __typename?: 'AuthPayloadType';
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserType>;
};

export enum CategoryEnumType {
  MemberOfParliament = 'MEMBER_OF_PARLIAMENT',
  NonCitizen = 'NON_CITIZEN',
  PublicServant = 'PUBLIC_SERVANT',
}

export type DashboardStatisticsType = {
  __typename?: 'DashboardStatisticsType';
  numberOfIdentityCardsPrinted: Scalars['Int']['output'];
  totalEmployees: Scalars['Int']['output'];
  totalIdentityCards: Scalars['Int']['output'];
  totalProvinces: Scalars['Int']['output'];
};

export type DashboardType = {
  __typename?: 'DashboardType';
  id: Scalars['ID']['output'];
  statistics: DashboardStatisticsType;
  user: UserType;
};

export enum DocumentStatusEnumType {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

export type DocumentType = {
  __typename?: 'DocumentType';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  file: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  status: DocumentStatusEnumType;
  type: DocumentTypeEnumType;
  updatedAt: Scalars['String']['output'];
  user: UserType;
};

export enum DocumentTypeEnumType {
  DrivingLicense = 'DRIVING_LICENSE',
  NationalId = 'NATIONAL_ID',
  Other = 'OTHER',
  Passport = 'PASSPORT',
  PaySlip = 'PAY_SLIP',
}

export type EmployeeStatisticsBreakdownByOrganisationCodeType = {
  __typename?: 'EmployeeStatisticsBreakdownByOrganisationCodeType';
  numberOfEmployees?: Maybe<Scalars['Int']['output']>;
  organisationCode?: Maybe<Scalars['String']['output']>;
};

export type FileUploadStatusType = {
  __typename?: 'FileUploadStatusType';
  createdAt?: Maybe<Scalars['String']['output']>;
  /** Id of Province */
  id: Scalars['ID']['output'];
  /** Name of the Province */
  name: Scalars['String']['output'];
  status: StatusEnumType;
  url: Scalars['String']['output'];
};

export type ForgotPassword = {
  __typename?: 'ForgotPassword';
  message?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['Boolean']['output']>;
};

export enum GenderEnumType {
  Female = 'FEMALE',
  Male = 'MALE',
  Other = 'OTHER',
}

export type IdentityCardAuditFilterType = {
  cardId?: InputMaybe<Scalars['ID']['input']>;
  scannedByUserId?: InputMaybe<Scalars['ID']['input']>;
};

export type IdentityCardAuditType = {
  __typename?: 'IdentityCardAuditType';
  card: IdentityCardType;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  scannedBy: UserType;
  updatedAt: Scalars['String']['output'];
};

export type IdentityCardAuditsType = {
  __typename?: 'IdentityCardAuditsType';
  nodes?: Maybe<Array<Maybe<IdentityCardAuditType>>>;
  pageInfo: PaginationType;
};

export type IdentityCardFilterType = {
  status?: InputMaybe<IdentityCardStatusEnumType>;
};

export enum IdentityCardStatusEnumType {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  PendingPrinting = 'PENDING_PRINTING',
}

export type IdentityCardType = {
  __typename?: 'IdentityCardType';
  cardNumber: Scalars['String']['output'];
  codeLink: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  expiryDate: Scalars['String']['output'];
  fileNumber: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  gender: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  issueDate: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  nationality: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
  province: Scalars['String']['output'];
  scanAudits: IdentityCardAuditsType;
  signature?: Maybe<Scalars['String']['output']>;
  status: IdentityCardStatusEnumType;
  updatedAt: Scalars['String']['output'];
  user: UserType;
};

export type IdentityCardTypeScanAuditsArgs = {
  cursor?: InputMaybe<Scalars['ID']['input']>;
  filters?: InputMaybe<IdentityCardAuditFilterType>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  sortType?: InputMaybe<SortTypeEnumType>;
};

export type IdentityCardsStatisticsType = {
  __typename?: 'IdentityCardsStatisticsType';
  identityCardStatisticsBreakdownByStatus?: Maybe<
    Array<Maybe<IdentityCardStatisticsBreakdownByStatusType>>
  >;
};

export type IdentityCardsType = {
  __typename?: 'IdentityCardsType';
  nodes: Array<IdentityCardType>;
  pageInfo: PaginationType;
  statistics: IdentityCardsStatisticsType;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptUserInvite?: Maybe<AuthPayloadType>;
  bulkUploadUser?: Maybe<FileUploadStatusType>;
  createCardScannedAuditLog?: Maybe<IdentityCardAuditType>;
  createDocument?: Maybe<DocumentType>;
  createIdentityCard?: Maybe<IdentityCardType>;
  createPrintSession: PrintSessionType;
  createProvince?: Maybe<ProvinceType>;
  createUser?: Maybe<UserType>;
  forgotPassword?: Maybe<ForgotPassword>;
  generateIdentityCardsForProvince?: Maybe<Scalars['Boolean']['output']>;
  login?: Maybe<AuthPayloadType>;
  markPrintSessionAsCancelled?: Maybe<PrintSessionType>;
  markPrintSessionAsPrinted?: Maybe<PrintSessionType>;
  removeProvince?: Maybe<ProvinceType>;
  removeUser?: Maybe<UserType>;
  signup?: Maybe<AuthPayloadType>;
  updateAddress?: Maybe<AddressType>;
  updateBulkUserStatus?: Maybe<Scalars['Boolean']['output']>;
  updateDocumentStatus?: Maybe<DocumentType>;
  updateIdentityCardStatus?: Maybe<IdentityCardType>;
  updateProvince?: Maybe<ProvinceType>;
  updateUser?: Maybe<UserType>;
  updateUserRole?: Maybe<UserType>;
  updateUserStatus?: Maybe<UserType>;
};

export type MutationAcceptUserInviteArgs = {
  inviteToken: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MutationBulkUploadUserArgs = {
  file: Scalars['Upload']['input'];
};

export type MutationCreateCardScannedAuditLogArgs = {
  cardId: Scalars['ID']['input'];
  latitude: Scalars['String']['input'];
  longitude: Scalars['String']['input'];
};

export type MutationCreateDocumentArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  file: Scalars['Upload']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  type: DocumentTypeEnumType;
  userId: Scalars['ID']['input'];
};

export type MutationCreateIdentityCardArgs = {
  cardNumber?: InputMaybe<Scalars['String']['input']>;
  expiryDate?: InputMaybe<Scalars['String']['input']>;
  issueDate?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};

export type MutationCreatePrintSessionArgs = {
  identityCardIds: Array<Scalars['ID']['input']>;
  provinceId: Scalars['ID']['input'];
};

export type MutationCreateProvinceArgs = {
  logo?: InputMaybe<Scalars['Upload']['input']>;
  name: Scalars['String']['input'];
  shortName: Scalars['String']['input'];
};

export type MutationCreateUserArgs = {
  category: CategoryEnumType;
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  dateOfBirth: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  gender: GenderEnumType;
  lastName: Scalars['String']['input'];
  line1: Scalars['String']['input'];
  line2?: InputMaybe<Scalars['String']['input']>;
  nationality: NationalityEnumType;
  photo?: InputMaybe<Scalars['Upload']['input']>;
  postalCode: Scalars['String']['input'];
  provinceId: Scalars['ID']['input'];
  provinceOfOrigin?: InputMaybe<Scalars['String']['input']>;
  state: Scalars['String']['input'];
};

export type MutationForgotPasswordArgs = {
  callBackUrl: Scalars['String']['input'];
  emailId: Scalars['String']['input'];
};

export type MutationGenerateIdentityCardsForProvinceArgs = {
  provinceId: Scalars['ID']['input'];
  userIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MutationMarkPrintSessionAsCancelledArgs = {
  id: Scalars['ID']['input'];
};

export type MutationMarkPrintSessionAsPrintedArgs = {
  id: Scalars['ID']['input'];
};

export type MutationRemoveProvinceArgs = {
  id: Scalars['ID']['input'];
};

export type MutationRemoveUserArgs = {
  id: Scalars['ID']['input'];
};

export type MutationSignupArgs = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  nationality: Scalars['Int']['input'];
  password: Scalars['String']['input'];
};

export type MutationUpdateAddressArgs = {
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  line1: Scalars['String']['input'];
  line2?: InputMaybe<Scalars['String']['input']>;
  postalCode: Scalars['String']['input'];
  state: Scalars['String']['input'];
};

export type MutationUpdateBulkUserStatusArgs = {
  ids: Array<Scalars['ID']['input']>;
  status: UserStatusEnumType;
};

export type MutationUpdateDocumentStatusArgs = {
  id: Scalars['ID']['input'];
  status: DocumentStatusEnumType;
};

export type MutationUpdateIdentityCardStatusArgs = {
  id: Scalars['ID']['input'];
  status: IdentityCardStatusEnumType;
};

export type MutationUpdateProvinceArgs = {
  cardNumberPrefix?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  logo?: InputMaybe<Scalars['Upload']['input']>;
  name: Scalars['String']['input'];
  shortName: Scalars['String']['input'];
  status: ProvinceStatusEnumType;
};

export type MutationUpdateUserArgs = {
  category: CategoryEnumType;
  dateOfBirth: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  gender: GenderEnumType;
  id: Scalars['ID']['input'];
  lastName: Scalars['String']['input'];
  middleName?: InputMaybe<Scalars['String']['input']>;
  nationality: NationalityEnumType;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['Upload']['input']>;
  provinceOfOrigin?: InputMaybe<Scalars['String']['input']>;
};

export type MutationUpdateUserRoleArgs = {
  id: Scalars['ID']['input'];
  role: RoleEnumType;
};

export type MutationUpdateUserStatusArgs = {
  id: Scalars['ID']['input'];
  status: UserStatusEnumType;
};

export enum NationalityEnumType {
  Afghanistan = 'AFGHANISTAN',
  AlandIslands = 'ALAND_ISLANDS',
  Albania = 'ALBANIA',
  Algeria = 'ALGERIA',
  AmericanSamoa = 'AMERICAN_SAMOA',
  Andorra = 'ANDORRA',
  Angola = 'ANGOLA',
  Anguilla = 'ANGUILLA',
  Antarctica = 'ANTARCTICA',
  AntiguaAndBarbuda = 'ANTIGUA_AND_BARBUDA',
  Argentina = 'ARGENTINA',
  Armenia = 'ARMENIA',
  Aruba = 'ARUBA',
  Australia = 'AUSTRALIA',
  Austria = 'AUSTRIA',
  Azerbaijan = 'AZERBAIJAN',
  Bahamas = 'BAHAMAS',
  Bahrain = 'BAHRAIN',
  Bangladesh = 'BANGLADESH',
  Barbados = 'BARBADOS',
  Belarus = 'BELARUS',
  Belgium = 'BELGIUM',
  Belize = 'BELIZE',
  Benin = 'BENIN',
  Bermuda = 'BERMUDA',
  Bhutan = 'BHUTAN',
  Bolivia = 'BOLIVIA',
  BosniaAndHerzegovina = 'BOSNIA_AND_HERZEGOVINA',
  Botswana = 'BOTSWANA',
  BouvetIsland = 'BOUVET_ISLAND',
  Brazil = 'BRAZIL',
  BritishIndianOceanTerritory = 'BRITISH_INDIAN_OCEAN_TERRITORY',
  BruneiDarussalam = 'BRUNEI_DARUSSALAM',
  Bulgaria = 'BULGARIA',
  BurkinaFaso = 'BURKINA_FASO',
  Burundi = 'BURUNDI',
  Cambodia = 'CAMBODIA',
  Cameroon = 'CAMEROON',
  Canada = 'CANADA',
  CapeVerde = 'CAPE_VERDE',
  CaymanIslands = 'CAYMAN_ISLANDS',
  CentralAfricanRepublic = 'CENTRAL_AFRICAN_REPUBLIC',
  Chad = 'CHAD',
  Chile = 'CHILE',
  China = 'CHINA',
  ChristmasIsland = 'CHRISTMAS_ISLAND',
  CocosKeelingIslands = 'COCOS_KEELING_ISLANDS',
  Colombia = 'COLOMBIA',
  Comoros = 'COMOROS',
  Congo = 'CONGO',
  CongoDemocraticRepublic = 'CONGO_DEMOCRATIC_REPUBLIC',
  CookIslands = 'COOK_ISLANDS',
  CostaRica = 'COSTA_RICA',
  CoteDivoire = 'COTE_DIVOIRE',
  Croatia = 'CROATIA',
  Cuba = 'CUBA',
  Cyprus = 'CYPRUS',
  CzechRepublic = 'CZECH_REPUBLIC',
  Denmark = 'DENMARK',
  Djibouti = 'DJIBOUTI',
  Dominica = 'DOMINICA',
  DominicanRepublic = 'DOMINICAN_REPUBLIC',
  Ecuador = 'ECUADOR',
  Egypt = 'EGYPT',
  ElSalvador = 'EL_SALVADOR',
  EquatorialGuinea = 'EQUATORIAL_GUINEA',
  Eritrea = 'ERITREA',
  Estonia = 'ESTONIA',
  Ethiopia = 'ETHIOPIA',
  FalklandIslandsMalvinas = 'FALKLAND_ISLANDS_MALVINAS',
  FaroeIslands = 'FAROE_ISLANDS',
  Fiji = 'FIJI',
  Finland = 'FINLAND',
  France = 'FRANCE',
  FrenchGuiana = 'FRENCH_GUIANA',
  FrenchPolynesia = 'FRENCH_POLYNESIA',
  FrenchSouthernTerritories = 'FRENCH_SOUTHERN_TERRITORIES',
  Gabon = 'GABON',
  Gambia = 'GAMBIA',
  Georgia = 'GEORGIA',
  Germany = 'GERMANY',
  Ghana = 'GHANA',
  Gibraltar = 'GIBRALTAR',
  Greece = 'GREECE',
  Greenland = 'GREENLAND',
  Grenada = 'GRENADA',
  Guadeloupe = 'GUADELOUPE',
  Guam = 'GUAM',
  Guatemala = 'GUATEMALA',
  Guernsey = 'GUERNSEY',
  Guinea = 'GUINEA',
  GuineaBissau = 'GUINEA_BISSAU',
  Guyana = 'GUYANA',
  Haiti = 'HAITI',
  HeardIslandAndMcdonaldIslands = 'HEARD_ISLAND_AND_MCDONALD_ISLANDS',
  HolySeeVaticanCityState = 'HOLY_SEE_VATICAN_CITY_STATE',
  Honduras = 'HONDURAS',
  HongKong = 'HONG_KONG',
  Hungary = 'HUNGARY',
  Iceland = 'ICELAND',
  India = 'INDIA',
  Indonesia = 'INDONESIA',
  IranIslamicRepublicOf = 'IRAN_ISLAMIC_REPUBLIC_OF',
  Iraq = 'IRAQ',
  Ireland = 'IRELAND',
  IsleOfMan = 'ISLE_OF_MAN',
  Israel = 'ISRAEL',
  Italy = 'ITALY',
  Jamaica = 'JAMAICA',
  Japan = 'JAPAN',
  Jersey = 'JERSEY',
  Jordan = 'JORDAN',
  Kazakhstan = 'KAZAKHSTAN',
  Kenya = 'KENYA',
  Kiribati = 'KIRIBATI',
  Korea = 'KOREA',
  Kuwait = 'KUWAIT',
  Kyrgyzstan = 'KYRGYZSTAN',
  LaoPeoplesDemocraticRepublic = 'LAO_PEOPLES_DEMOCRATIC_REPUBLIC',
  Latvia = 'LATVIA',
  Lebanon = 'LEBANON',
  Lesotho = 'LESOTHO',
  Liberia = 'LIBERIA',
  LibyanArabJamahiriya = 'LIBYAN_ARAB_JAMAHIRIYA',
  Liechtenstein = 'LIECHTENSTEIN',
  Lithuania = 'LITHUANIA',
  Luxembourg = 'LUXEMBOURG',
  Macao = 'MACAO',
  Macedonia = 'MACEDONIA',
  Madagascar = 'MADAGASCAR',
  Malawi = 'MALAWI',
  Malaysia = 'MALAYSIA',
  Maldives = 'MALDIVES',
  Mali = 'MALI',
  Malta = 'MALTA',
  MarshallIslands = 'MARSHALL_ISLANDS',
  Martinique = 'MARTINIQUE',
  Mauritania = 'MAURITANIA',
  Mauritius = 'MAURITIUS',
  Mayotte = 'MAYOTTE',
  Mexico = 'MEXICO',
  MicronesiaFederatedStatesOf = 'MICRONESIA_FEDERATED_STATES_OF',
  Moldova = 'MOLDOVA',
  Monaco = 'MONACO',
  Mongolia = 'MONGOLIA',
  Montenegro = 'MONTENEGRO',
  Montserrat = 'MONTSERRAT',
  Morocco = 'MOROCCO',
  Mozambique = 'MOZAMBIQUE',
  Myanmar = 'MYANMAR',
  Namibia = 'NAMIBIA',
  Nauru = 'NAURU',
  Nepal = 'NEPAL',
  Netherlands = 'NETHERLANDS',
  NetherlandsAntilles = 'NETHERLANDS_ANTILLES',
  NewCaledonia = 'NEW_CALEDONIA',
  NewZealand = 'NEW_ZEALAND',
  Nicaragua = 'NICARAGUA',
  Niger = 'NIGER',
  Nigeria = 'NIGERIA',
  Niue = 'NIUE',
  NorfolkIsland = 'NORFOLK_ISLAND',
  NorthernMarianaIslands = 'NORTHERN_MARIANA_ISLANDS',
  NorthKorea = 'NORTH_KOREA',
  Norway = 'NORWAY',
  Oman = 'OMAN',
  Pakistan = 'PAKISTAN',
  Palau = 'PALAU',
  PalestinianTerritoryOccupied = 'PALESTINIAN_TERRITORY_OCCUPIED',
  Panama = 'PANAMA',
  PapuaNewGuinea = 'PAPUA_NEW_GUINEA',
  Paraguay = 'PARAGUAY',
  Peru = 'PERU',
  Philippines = 'PHILIPPINES',
  Pitcairn = 'PITCAIRN',
  Poland = 'POLAND',
  Portugal = 'PORTUGAL',
  PuertoRico = 'PUERTO_RICO',
  Qatar = 'QATAR',
  Reunion = 'REUNION',
  Romania = 'ROMANIA',
  RussianFederation = 'RUSSIAN_FEDERATION',
  Rwanda = 'RWANDA',
  SaintBarthelemy = 'SAINT_BARTHELEMY',
  SaintHelena = 'SAINT_HELENA',
  SaintKittsAndNevis = 'SAINT_KITTS_AND_NEVIS',
  SaintLucia = 'SAINT_LUCIA',
  SaintMartin = 'SAINT_MARTIN',
  SaintPierreAndMiquelon = 'SAINT_PIERRE_AND_MIQUELON',
  SaintVincentAndGrenadines = 'SAINT_VINCENT_AND_GRENADINES',
  Samoa = 'SAMOA',
  SanMarino = 'SAN_MARINO',
  SaoTomeAndPrincipe = 'SAO_TOME_AND_PRINCIPE',
  SaudiArabia = 'SAUDI_ARABIA',
  Senegal = 'SENEGAL',
  Serbia = 'SERBIA',
  Seychelles = 'SEYCHELLES',
  SierraLeone = 'SIERRA_LEONE',
  Singapore = 'SINGAPORE',
  Slovakia = 'SLOVAKIA',
  Slovenia = 'SLOVENIA',
  SolomonIslands = 'SOLOMON_ISLANDS',
  Somalia = 'SOMALIA',
  SouthAfrica = 'SOUTH_AFRICA',
  SouthGeorgiaAndSandwichIsl = 'SOUTH_GEORGIA_AND_SANDWICH_ISL',
  Spain = 'SPAIN',
  SriLanka = 'SRI_LANKA',
  Sudan = 'SUDAN',
  Suriname = 'SURINAME',
  SvalbardAndJanMayen = 'SVALBARD_AND_JAN_MAYEN',
  Swaziland = 'SWAZILAND',
  Sweden = 'SWEDEN',
  Switzerland = 'SWITZERLAND',
  SyrianArabRepublic = 'SYRIAN_ARAB_REPUBLIC',
  Taiwan = 'TAIWAN',
  Tajikistan = 'TAJIKISTAN',
  Tanzania = 'TANZANIA',
  Thailand = 'THAILAND',
  TimorLeste = 'TIMOR_LESTE',
  Togo = 'TOGO',
  Tokelau = 'TOKELAU',
  Tonga = 'TONGA',
  TrinidadAndTobago = 'TRINIDAD_AND_TOBAGO',
  Tunisia = 'TUNISIA',
  Turkey = 'TURKEY',
  Turkmenistan = 'TURKMENISTAN',
  TurksAndCaicosIslands = 'TURKS_AND_CAICOS_ISLANDS',
  Tuvalu = 'TUVALU',
  Uganda = 'UGANDA',
  Ukraine = 'UKRAINE',
  UnitedArabEmirates = 'UNITED_ARAB_EMIRATES',
  UnitedKingdom = 'UNITED_KINGDOM',
  UnitedStates = 'UNITED_STATES',
  UnitedStatesOutlyingIslands = 'UNITED_STATES_OUTLYING_ISLANDS',
  Uruguay = 'URUGUAY',
  Uzbekistan = 'UZBEKISTAN',
  Vanuatu = 'VANUATU',
  Venezuela = 'VENEZUELA',
  Vietnam = 'VIETNAM',
  VirginIslandsBritish = 'VIRGIN_ISLANDS_BRITISH',
  VirginIslandsUs = 'VIRGIN_ISLANDS_US',
  WallisAndFutuna = 'WALLIS_AND_FUTUNA',
  WesternSahara = 'WESTERN_SAHARA',
  Yemen = 'YEMEN',
  Zambia = 'ZAMBIA',
  Zimbabwe = 'ZIMBABWE',
}

export type PaginationType = {
  __typename?: 'PaginationType';
  cursor?: Maybe<Scalars['ID']['output']>;
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export enum PrintSessionStatusEnumType {
  Cancelled = 'CANCELLED',
  Pending = 'PENDING',
  Printed = 'PRINTED',
}

export type PrintSessionType = {
  __typename?: 'PrintSessionType';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  identityCards: Array<IdentityCardType>;
  initiatedBy: UserType;
  name: Scalars['String']['output'];
  province: ProvinceType;
  status: PrintSessionStatusEnumType;
  updatedAt: Scalars['String']['output'];
};

export type PrintSessionsType = {
  __typename?: 'PrintSessionsType';
  nodes: Array<PrintSessionType>;
  pageInfo: PaginationType;
};

export enum ProvinceStatusEnumType {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

/** Province */
export type ProvinceType = {
  __typename?: 'ProvinceType';
  cardNumberPrefix?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  identityCards: IdentityCardsType;
  logo?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  printSessions: PrintSessionsType;
  shortName?: Maybe<Scalars['String']['output']>;
  status: ProvinceStatusEnumType;
  updatedAt?: Maybe<Scalars['String']['output']>;
  users: UsersType;
};

/** Province */
export type ProvinceTypeIdentityCardsArgs = {
  cursor?: InputMaybe<Scalars['ID']['input']>;
  filters?: InputMaybe<IdentityCardFilterType>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

/** Province */
export type ProvinceTypePrintSessionsArgs = {
  cursor?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

/** Province */
export type ProvinceTypeUsersArgs = {
  cursor?: InputMaybe<Scalars['ID']['input']>;
  filters?: InputMaybe<UserFilterInputType>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  dashboard: DashboardType;
  document?: Maybe<DocumentType>;
  identityCard: IdentityCardType;
  identityCardAudit: IdentityCardAuditType;
  identityCardAudits: IdentityCardAuditsType;
  printSession: PrintSessionType;
  province: ProvinceType;
  provinces: Array<ProvinceType>;
  user: UserType;
  users: UsersType;
};

export type QueryDocumentArgs = {
  id: Scalars['ID']['input'];
};

export type QueryIdentityCardArgs = {
  id: Scalars['ID']['input'];
};

export type QueryIdentityCardAuditArgs = {
  id: Scalars['ID']['input'];
};

export type QueryIdentityCardAuditsArgs = {
  cursor?: InputMaybe<Scalars['ID']['input']>;
  filters?: InputMaybe<IdentityCardAuditFilterType>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  sortType?: InputMaybe<SortTypeEnumType>;
};

export type QueryPrintSessionArgs = {
  id: Scalars['ID']['input'];
};

export type QueryProvinceArgs = {
  id: Scalars['ID']['input'];
};

export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type QueryUsersArgs = {
  cursor?: InputMaybe<Scalars['ID']['input']>;
  filters?: InputMaybe<UserFilterInputType>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  sortType?: InputMaybe<SortTypeEnumType>;
};

export enum RoleEnumType {
  Admin = 'ADMIN',
  Employee = 'EMPLOYEE',
  Other = 'OTHER',
  SuperAdmin = 'SUPER_ADMIN',
}

export enum SortTypeEnumType {
  Ascending = 'ASCENDING',
  Descending = 'DESCENDING',
}

export enum StatusEnumType {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

export type UserFilterInputType = {
  provinceId?: InputMaybe<Scalars['ID']['input']>;
  roles?: InputMaybe<Array<InputMaybe<RoleEnumType>>>;
  status?: InputMaybe<UserStatusEnumType>;
  text?: InputMaybe<Scalars['String']['input']>;
};

export type UserStatisticsBreakdownByStatusType = {
  __typename?: 'UserStatisticsBreakdownByStatusType';
  numberOfUsers?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<UserStatusEnumType>;
};

export enum UserStatusEnumType {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Invited = 'INVITED',
}

export type UserType = {
  __typename?: 'UserType';
  address?: Maybe<AddressType>;
  category: CategoryEnumType;
  createdAt?: Maybe<Scalars['String']['output']>;
  dateOfBirth: Scalars['String']['output'];
  documents: Array<DocumentType>;
  email?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  gender: GenderEnumType;
  id: Scalars['ID']['output'];
  identityCards: Array<IdentityCardType>;
  lastName: Scalars['String']['output'];
  middleName?: Maybe<Scalars['String']['output']>;
  nationality: NationalityEnumType;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  photo?: Maybe<Scalars['String']['output']>;
  province: ProvinceType;
  provinceOfOrigin?: Maybe<Scalars['String']['output']>;
  status: UserStatusEnumType;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type UsersStatisticsType = {
  __typename?: 'UsersStatisticsType';
  employeeStatisticsBreakdownByOrganisationCode?: Maybe<
    Array<Maybe<EmployeeStatisticsBreakdownByOrganisationCodeType>>
  >;
  userStatisticsBreakdownByIdentityCardStatus?: Maybe<
    Array<Maybe<UserStatisticsBreakdownByStatusType>>
  >;
  userStatisticsBreakdownByStatus?: Maybe<Array<Maybe<UserStatisticsBreakdownByStatusType>>>;
};

export type UsersStatisticsTypeEmployeeStatisticsBreakdownByOrganisationCodeArgs = {
  provinceId: Scalars['ID']['input'];
};

export type UsersStatisticsTypeUserStatisticsBreakdownByIdentityCardStatusArgs = {
  provinceId: Scalars['ID']['input'];
};

export type UsersStatisticsTypeUserStatisticsBreakdownByStatusArgs = {
  provinceId: Scalars['ID']['input'];
};

export type UsersType = {
  __typename?: 'UsersType';
  nodes: Array<UserType>;
  pageInfo: PaginationType;
  statistics: UsersStatisticsType;
};

export type IdentityCardStatisticsBreakdownByStatusType = {
  __typename?: 'identityCardStatisticsBreakdownByStatusType';
  numberOfIdentityCards?: Maybe<Scalars['Int']['output']>;
  status?: Maybe<IdentityCardStatusEnumType>;
};

export type UserFragmentCreateUserNewFragment = {
  __typename?: 'UserType';
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: GenderEnumType;
  dateOfBirth: string;
  nationality: NationalityEnumType;
  provinceOfOrigin?: string | null;
  province: { __typename?: 'ProvinceType'; id: string; name: string };
  address?: {
    __typename?: 'AddressType';
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
} & { ' $fragmentName'?: 'UserFragmentCreateUserNewFragment' };

export type CreateUserMutationVariables = Exact<{
  provinceId: Scalars['ID']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  gender: GenderEnumType;
  dateOfBirth: Scalars['String']['input'];
  nationality: NationalityEnumType;
  provinceOfOrigin?: InputMaybe<Scalars['String']['input']>;
  category: CategoryEnumType;
  photo?: InputMaybe<Scalars['Upload']['input']>;
  line1: Scalars['String']['input'];
  line2?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  state: Scalars['String']['input'];
  country: Scalars['String']['input'];
  postalCode: Scalars['String']['input'];
}>;

export type CreateUserMutation = {
  __typename?: 'Mutation';
  createUser?:
    | ({ __typename?: 'UserType' } & {
        ' $fragmentRefs'?: { UserFragmentCreateUserNewFragment: UserFragmentCreateUserNewFragment };
      })
    | null;
};

export type ProvincesNewQueryVariables = Exact<{ [key: string]: never }>;

export type ProvincesNewQuery = {
  __typename?: 'Query';
  provinces: Array<{ __typename?: 'ProvinceType'; id: string; name: string }>;
};

export type UpdateIdentityCardStatusMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  status: IdentityCardStatusEnumType;
}>;

export type UpdateIdentityCardStatusMutation = {
  __typename?: 'Mutation';
  updateIdentityCardStatus?: {
    __typename?: 'IdentityCardType';
    id: string;
    status: IdentityCardStatusEnumType;
    updatedAt: string;
  } | null;
};

export type IdentityCardInfoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type IdentityCardInfoQuery = {
  __typename?: 'Query';
  identityCard: {
    __typename?: 'IdentityCardType';
    id: string;
    cardNumber: string;
    codeLink: string;
    status: IdentityCardStatusEnumType;
    issueDate: string;
    expiryDate: string;
    updatedAt: string;
    createdAt: string;
    user: {
      __typename?: 'UserType';
      id: string;
      firstName: string;
      lastName: string;
      gender: GenderEnumType;
      nationality: NationalityEnumType;
      photo?: string | null;
      province: { __typename?: 'ProvinceType'; id: string; name: string };
    };
  };
};

export type CreatePrintSessionMutationVariables = Exact<{
  identityCardIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  provinceId: Scalars['ID']['input'];
}>;

export type CreatePrintSessionMutation = {
  __typename?: 'Mutation';
  createPrintSession: {
    __typename?: 'PrintSessionType';
    id: string;
    name: string;
    status: PrintSessionStatusEnumType;
    createdAt: string;
  };
};

export type IdentityCardScanLogsQueryVariables = Exact<{
  identityCardId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;

export type IdentityCardScanLogsQuery = {
  __typename?: 'Query';
  identityCard: {
    __typename?: 'IdentityCardType';
    id: string;
    scanAudits: {
      __typename?: 'IdentityCardAuditsType';
      nodes?: Array<{
        __typename?: 'IdentityCardAuditType';
        id: string;
        latitude: number;
        longitude: number;
        createdAt: string;
        scannedBy: { __typename?: 'UserType'; id: string; fullName: string };
        card: { __typename?: 'IdentityCardType'; id: string; cardNumber: string };
      } | null> | null;
      pageInfo: {
        __typename?: 'PaginationType';
        cursor?: string | null;
        hasNextPage?: boolean | null;
        totalCount?: number | null;
      };
    };
  };
};

export type IdentityCardQueryVariables = Exact<{
  identityCardId: Scalars['ID']['input'];
}>;

export type IdentityCardQuery = {
  __typename?: 'Query';
  identityCard: { __typename?: 'IdentityCardType'; id: string; cardNumber: string };
};

export type IdentityCardUserQueryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type IdentityCardUserQueryQuery = {
  __typename?: 'Query';
  user: {
    __typename?: 'UserType';
    id: string;
    documents: Array<{
      __typename?: 'DocumentType';
      id: string;
      type: DocumentTypeEnumType;
      name: string;
      description?: string | null;
      file: string;
    }>;
  };
};

export type IdentityCardUserQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type IdentityCardUserQuery = {
  __typename?: 'Query';
  identityCard: {
    __typename?: 'IdentityCardType';
    id: string;
    cardNumber: string;
    issueDate: string;
    expiryDate: string;
    user: {
      __typename?: 'UserType';
      id: string;
      fullName: string;
      firstName: string;
      middleName?: string | null;
      lastName: string;
      email?: string | null;
      phoneNumber?: string | null;
      gender: GenderEnumType;
      dateOfBirth: string;
      category: CategoryEnumType;
      photo?: string | null;
      createdAt?: string | null;
      province: {
        __typename?: 'ProvinceType';
        name: string;
        shortName?: string | null;
        logo?: string | null;
      };
      address?: {
        __typename?: 'AddressType';
        line1: string;
        line2?: string | null;
        city: string;
        state: string;
        country: string;
      } | null;
    };
  };
};

export type PrintSessionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type PrintSessionQuery = {
  __typename?: 'Query';
  printSession: {
    __typename?: 'PrintSessionType';
    id: string;
    name: string;
    status: PrintSessionStatusEnumType;
    createdAt: string;
    province: { __typename?: 'ProvinceType'; id: string; name: string };
    identityCards: Array<{
      __typename?: 'IdentityCardType';
      id: string;
      cardNumber: string;
      codeLink: string;
      status: IdentityCardStatusEnumType;
      issueDate: string;
      expiryDate: string;
      updatedAt: string;
      createdAt: string;
      user: {
        __typename?: 'UserType';
        id: string;
        firstName: string;
        lastName: string;
        gender: GenderEnumType;
        dateOfBirth: string;
        category: CategoryEnumType;
        nationality: NationalityEnumType;
        provinceOfOrigin?: string | null;
        photo?: string | null;
        province: { __typename?: 'ProvinceType'; id: string; name: string };
        address?: { __typename?: 'AddressType'; line1: string; city: string } | null;
      };
    }>;
  };
};

export type MarkPrintSessionAsPrintedMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type MarkPrintSessionAsPrintedMutation = {
  __typename?: 'Mutation';
  markPrintSessionAsPrinted?: {
    __typename?: 'PrintSessionType';
    id: string;
    status: PrintSessionStatusEnumType;
  } | null;
};

export type MarkPrintSessionAsCancelledMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type MarkPrintSessionAsCancelledMutation = {
  __typename?: 'Mutation';
  markPrintSessionAsCancelled?: {
    __typename?: 'PrintSessionType';
    id: string;
    status: PrintSessionStatusEnumType;
  } | null;
};

export type CreateDocumentMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  type: DocumentTypeEnumType;
  file: Scalars['Upload']['input'];
}>;

export type CreateDocumentMutation = {
  __typename?: 'Mutation';
  createDocument?: {
    __typename?: 'DocumentType';
    id: string;
    name: string;
    description?: string | null;
    type: DocumentTypeEnumType;
    file: string;
    status: DocumentStatusEnumType;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type NewDocumentFragment = {
  __typename?: 'DocumentType';
  id: string;
  name: string;
  description?: string | null;
  type: DocumentTypeEnumType;
  file: string;
  status: DocumentStatusEnumType;
  updatedAt: string;
  createdAt: string;
} & { ' $fragmentName'?: 'NewDocumentFragment' };

export type UserDocumentsQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;

export type UserDocumentsQuery = {
  __typename?: 'Query';
  user: {
    __typename?: 'UserType';
    id: string;
    documents: Array<{
      __typename?: 'DocumentType';
      id: string;
      type: DocumentTypeEnumType;
      name: string;
      description?: string | null;
      file: string;
      status: DocumentStatusEnumType;
      createdAt: string;
    }>;
  };
};

export type CreateIdentityCardMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  cardNumber: Scalars['String']['input'];
  issueDate: Scalars['String']['input'];
  expiryDate: Scalars['String']['input'];
}>;

export type CreateIdentityCardMutation = {
  __typename?: 'Mutation';
  createIdentityCard?: {
    __typename?: 'IdentityCardType';
    id: string;
    cardNumber: string;
    issueDate: string;
    expiryDate: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type NewIdentityCardFragment = {
  __typename?: 'IdentityCardType';
  id: string;
  cardNumber: string;
  issueDate: string;
  expiryDate: string;
  status: IdentityCardStatusEnumType;
  updatedAt: string;
  createdAt: string;
} & { ' $fragmentName'?: 'NewIdentityCardFragment' };

export type IdentityCardsQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;

export type IdentityCardsQuery = {
  __typename?: 'Query';
  user: {
    __typename?: 'UserType';
    id: string;
    identityCards: Array<{
      __typename?: 'IdentityCardType';
      id: string;
      cardNumber: string;
      status: IdentityCardStatusEnumType;
      issueDate: string;
      expiryDate: string;
      createdAt: string;
    }>;
  };
};

export type RemoveUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;

export type RemoveUserMutation = {
  __typename?: 'Mutation';
  removeUser?: { __typename?: 'UserType'; id: string } | null;
};

export type UpdateAddressMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  line1: Scalars['String']['input'];
  line2?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  postalCode: Scalars['String']['input'];
  state: Scalars['String']['input'];
  country: Scalars['String']['input'];
}>;

export type UpdateAddressMutation = {
  __typename?: 'Mutation';
  updateAddress?: {
    __typename?: 'AddressType';
    id: string;
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
};

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  phoneNumber: Scalars['String']['input'];
  dateOfBirth: Scalars['String']['input'];
  gender: GenderEnumType;
  nationality: NationalityEnumType;
  provinceOfOrigin?: InputMaybe<Scalars['String']['input']>;
  category: CategoryEnumType;
  photo?: InputMaybe<Scalars['Upload']['input']>;
}>;

export type UpdateUserMutation = {
  __typename?: 'Mutation';
  updateUser?: {
    __typename?: 'UserType';
    id: string;
    firstName: string;
    lastName: string;
    email?: string | null;
    phoneNumber?: string | null;
    gender: GenderEnumType;
    dateOfBirth: string;
    nationality: NationalityEnumType;
    category: CategoryEnumType;
    provinceOfOrigin?: string | null;
    photo?: string | null;
  } | null;
};

export type UpdateUserStatusMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  status: UserStatusEnumType;
}>;

export type UpdateUserStatusMutation = {
  __typename?: 'Mutation';
  updateUserStatus?: {
    __typename?: 'UserType';
    id: string;
    status: UserStatusEnumType;
    updatedAt?: string | null;
  } | null;
};

export type UserInformationQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;

export type UserInformationQuery = {
  __typename?: 'Query';
  user: {
    __typename?: 'UserType';
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email?: string | null;
    phoneNumber?: string | null;
    status: UserStatusEnumType;
    category: CategoryEnumType;
    nationality: NationalityEnumType;
    provinceOfOrigin?: string | null;
    gender: GenderEnumType;
    dateOfBirth: string;
    photo?: string | null;
    createdAt?: string | null;
    province: { __typename?: 'ProvinceType'; id: string; name: string };
    address?: {
      __typename?: 'AddressType';
      id: string;
      line1: string;
      line2?: string | null;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    } | null;
  };
};

export type GetUserQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;

export type GetUserQuery = {
  __typename?: 'Query';
  user: { __typename?: 'UserType'; id: string; fullName: string };
};

export type AdministrationUsersQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  cursor?: InputMaybe<Scalars['ID']['input']>;
  filters?: InputMaybe<UserFilterInputType>;
}>;

export type AdministrationUsersQuery = {
  __typename?: 'Query';
  users: {
    __typename?: 'UsersType';
    nodes: Array<{
      __typename?: 'UserType';
      id: string;
      fullName: string;
      category: CategoryEnumType;
      status: UserStatusEnumType;
      createdAt?: string | null;
      province: { __typename?: 'ProvinceType'; id: string; name: string };
    }>;
    pageInfo: {
      __typename?: 'PaginationType';
      cursor?: string | null;
      totalCount?: number | null;
      hasNextPage?: boolean | null;
    };
  };
};

export const UserFragmentCreateUserNewFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserFragmentCreateUserNew' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserType' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'province' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gender' } },
          { kind: 'Field', name: { kind: 'Name', value: 'dateOfBirth' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nationality' } },
          { kind: 'Field', name: { kind: 'Name', value: 'provinceOfOrigin' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'address' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'line1' } },
                { kind: 'Field', name: { kind: 'Name', value: 'line2' } },
                { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
                { kind: 'Field', name: { kind: 'Name', value: 'country' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserFragmentCreateUserNewFragment, unknown>;
export const NewDocumentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'NewDocument' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentType' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          { kind: 'Field', name: { kind: 'Name', value: 'type' } },
          { kind: 'Field', name: { kind: 'Name', value: 'file' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<NewDocumentFragment, unknown>;
export const NewIdentityCardFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'NewIdentityCard' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'IdentityCardType' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'cardNumber' } },
          { kind: 'Field', name: { kind: 'Name', value: 'issueDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'expiryDate' } },
          { kind: 'Field', name: { kind: 'Name', value: 'status' } },
          { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<NewIdentityCardFragment, unknown>;
export const CreateUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'provinceId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'firstName' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'lastName' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'gender' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'GenderEnumType' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'dateOfBirth' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'nationality' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'NationalityEnumType' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'provinceOfOrigin' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'category' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CategoryEnumType' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'photo' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Upload' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'line1' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'line2' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'city' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'state' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'country' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'postalCode' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'provinceId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'provinceId' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'firstName' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'firstName' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'lastName' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'lastName' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'gender' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'gender' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'dateOfBirth' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'dateOfBirth' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'nationality' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'nationality' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'provinceOfOrigin' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'provinceOfOrigin' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'category' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'category' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'photo' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'photo' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'line1' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'line1' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'line2' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'line2' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'city' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'city' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'state' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'state' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'country' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'country' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'postalCode' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'postalCode' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'UserFragmentCreateUserNew' },
                },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'UserFragmentCreateUserNew' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'UserType' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'province' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
          { kind: 'Field', name: { kind: 'Name', value: 'gender' } },
          { kind: 'Field', name: { kind: 'Name', value: 'dateOfBirth' } },
          { kind: 'Field', name: { kind: 'Name', value: 'nationality' } },
          { kind: 'Field', name: { kind: 'Name', value: 'provinceOfOrigin' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'address' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'line1' } },
                { kind: 'Field', name: { kind: 'Name', value: 'line2' } },
                { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
                { kind: 'Field', name: { kind: 'Name', value: 'country' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const ProvincesNewDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ProvincesNew' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'provinces' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ProvincesNewQuery, ProvincesNewQueryVariables>;
export const UpdateIdentityCardStatusDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateIdentityCardStatus' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'status' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'IdentityCardStatusEnumType' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateIdentityCardStatus' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'status' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'status' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateIdentityCardStatusMutation,
  UpdateIdentityCardStatusMutationVariables
>;
export const IdentityCardInfoDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'IdentityCardInfo' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'identityCard' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'cardNumber' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'gender' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'nationality' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'province' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'photo' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'codeLink' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'issueDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'expiryDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<IdentityCardInfoQuery, IdentityCardInfoQueryVariables>;
export const CreatePrintSessionDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreatePrintSession' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'identityCardIds' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
              },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'provinceId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createPrintSession' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'identityCardIds' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'identityCardIds' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'provinceId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'provinceId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreatePrintSessionMutation, CreatePrintSessionMutationVariables>;
export const IdentityCardScanLogsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'IdentityCardScanLogs' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'identityCardId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'identityCard' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'identityCardId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'scanAudits' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'limit' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'nodes' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'scannedBy' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                                ],
                              },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: 'latitude' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'longitude' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'card' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'cardNumber' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'pageInfo' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'cursor' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'hasNextPage' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<IdentityCardScanLogsQuery, IdentityCardScanLogsQueryVariables>;
export const IdentityCardDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'IdentityCard' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'identityCardId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'identityCard' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'identityCardId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'cardNumber' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<IdentityCardQuery, IdentityCardQueryVariables>;
export const IdentityCardUserQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'IdentityCardUserQuery' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'documents' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'file' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<IdentityCardUserQueryQuery, IdentityCardUserQueryQueryVariables>;
export const IdentityCardUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'IdentityCardUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'identityCard' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'middleName' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'gender' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'dateOfBirth' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'photo' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'province' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'shortName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'logo' } },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'address' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'line1' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'line2' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'country' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'cardNumber' } },
                { kind: 'Field', name: { kind: 'Name', value: 'issueDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'expiryDate' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<IdentityCardUserQuery, IdentityCardUserQueryVariables>;
export const PrintSessionDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'PrintSession' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'printSession' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'province' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'identityCards' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'cardNumber' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'user' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'gender' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'dateOfBirth' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'province' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                ],
                              },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: 'nationality' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'provinceOfOrigin' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'photo' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'address' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'line1' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'codeLink' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'issueDate' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'expiryDate' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PrintSessionQuery, PrintSessionQueryVariables>;
export const MarkPrintSessionAsPrintedDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'MarkPrintSessionAsPrinted' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'markPrintSessionAsPrinted' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  MarkPrintSessionAsPrintedMutation,
  MarkPrintSessionAsPrintedMutationVariables
>;
export const MarkPrintSessionAsCancelledDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'MarkPrintSessionAsCancelled' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'markPrintSessionAsCancelled' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  MarkPrintSessionAsCancelledMutation,
  MarkPrintSessionAsCancelledMutationVariables
>;
export const CreateDocumentDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateDocument' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'description' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'type' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'DocumentTypeEnumType' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'file' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Upload' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createDocument' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'userId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'description' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'description' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'type' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'type' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'file' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'file' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                { kind: 'Field', name: { kind: 'Name', value: 'file' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateDocumentMutation, CreateDocumentMutationVariables>;
export const UserDocumentsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'UserDocuments' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'documents' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'file' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserDocumentsQuery, UserDocumentsQueryVariables>;
export const CreateIdentityCardDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateIdentityCard' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'cardNumber' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'issueDate' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'expiryDate' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createIdentityCard' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'userId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'cardNumber' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'cardNumber' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'issueDate' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'issueDate' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'expiryDate' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'expiryDate' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'cardNumber' } },
                { kind: 'Field', name: { kind: 'Name', value: 'issueDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'expiryDate' } },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateIdentityCardMutation, CreateIdentityCardMutationVariables>;
export const IdentityCardsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'IdentityCards' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'identityCards' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'cardNumber' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'issueDate' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'expiryDate' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<IdentityCardsQuery, IdentityCardsQueryVariables>;
export const RemoveUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RemoveUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'removeUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RemoveUserMutation, RemoveUserMutationVariables>;
export const UpdateAddressDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateAddress' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'line1' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'line2' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'city' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'postalCode' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'state' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'country' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateAddress' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'line1' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'line1' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'line2' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'line2' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'city' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'city' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'postalCode' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'postalCode' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'state' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'state' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'country' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'country' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'line1' } },
                { kind: 'Field', name: { kind: 'Name', value: 'line2' } },
                { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
                { kind: 'Field', name: { kind: 'Name', value: 'country' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateAddressMutation, UpdateAddressMutationVariables>;
export const UpdateUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'firstName' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'lastName' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'phoneNumber' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'dateOfBirth' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'gender' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'GenderEnumType' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'nationality' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'NationalityEnumType' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'provinceOfOrigin' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'category' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CategoryEnumType' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'photo' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Upload' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'firstName' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'firstName' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'lastName' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'lastName' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'email' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'email' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'phoneNumber' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'phoneNumber' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'gender' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'gender' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'dateOfBirth' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'dateOfBirth' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'nationality' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'nationality' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'category' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'category' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'provinceOfOrigin' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'provinceOfOrigin' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'photo' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'photo' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
                { kind: 'Field', name: { kind: 'Name', value: 'gender' } },
                { kind: 'Field', name: { kind: 'Name', value: 'dateOfBirth' } },
                { kind: 'Field', name: { kind: 'Name', value: 'nationality' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'provinceOfOrigin' } },
                { kind: 'Field', name: { kind: 'Name', value: 'photo' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const UpdateUserStatusDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateUserStatus' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'status' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UserStatusEnumType' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateUserStatus' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'status' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'status' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateUserStatusMutation, UpdateUserStatusMutationVariables>;
export const UserInformationDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'UserInformation' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
                { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                { kind: 'Field', name: { kind: 'Name', value: 'nationality' } },
                { kind: 'Field', name: { kind: 'Name', value: 'provinceOfOrigin' } },
                { kind: 'Field', name: { kind: 'Name', value: 'gender' } },
                { kind: 'Field', name: { kind: 'Name', value: 'dateOfBirth' } },
                { kind: 'Field', name: { kind: 'Name', value: 'photo' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'province' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'address' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'line1' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'line2' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'city' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'state' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'postalCode' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'country' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserInformationQuery, UserInformationQueryVariables>;
export const GetUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'getUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'user' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const AdministrationUsersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'AdministrationUsers' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'cursor' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'filters' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'UserFilterInputType' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'users' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'limit' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'cursor' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'cursor' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filters' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'filters' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'fullName' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'category' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'province' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'status' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'cursor' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'hasNextPage' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AdministrationUsersQuery, AdministrationUsersQueryVariables>;
