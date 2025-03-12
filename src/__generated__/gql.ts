/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

import * as types from './graphql';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  '\n  fragment UserFragmentCreateUserNew on UserType {\n    id\n    province {\n      id\n      name\n    }\n    firstName\n    lastName\n    fullName\n    gender\n    dateOfBirth\n    nationality\n    provinceOfOrigin\n    address {\n      line1\n      line2\n      city\n      state\n      postalCode\n      country\n    }\n  }\n': typeof types.UserFragmentCreateUserNewFragmentDoc;
  '\n  \n  mutation CreateUser(\n    $provinceId: ID!\n    $firstName: String!\n    $lastName: String!\n    $gender: GenderEnumType!\n    $dateOfBirth: String!\n    $nationality: NationalityEnumType!\n    $provinceOfOrigin: String\n    $category: CategoryEnumType!\n    $photo: Upload\n    $line1: String!\n    $line2: String\n    $city: String!\n    $state: String!\n    $country: String!\n    $postalCode: String!\n  ) {\n    createUser(\n      provinceId: $provinceId\n      firstName: $firstName\n      lastName: $lastName\n      gender: $gender\n      dateOfBirth: $dateOfBirth\n      nationality: $nationality\n      provinceOfOrigin: $provinceOfOrigin\n      category: $category\n      photo: $photo\n      line1: $line1\n      line2: $line2\n      city: $city\n      state: $state\n      country: $country\n      postalCode: $postalCode\n    ) {\n      ...UserFragmentCreateUserNew\n    }\n  }\n': typeof types.CreateUserDocument;
  '\n  query ProvincesNew {\n    provinces {\n      id\n      name\n    }\n  }\n': typeof types.ProvincesNewDocument;
  '\n  mutation UpdateIdentityCardStatus($id: ID!, $status: IdentityCardStatusEnumType!) {\n    updateIdentityCardStatus(id: $id, status: $status) {\n      id\n      status\n      updatedAt\n    }\n  }\n': typeof types.UpdateIdentityCardStatusDocument;
  '\n  query IdentityCardInfo($id: ID!) {\n    identityCard(id: $id) {\n      id\n      cardNumber\n      user {\n        id\n        firstName\n        lastName\n        gender\n        nationality\n        province {\n          id\n          name\n        }\n        photo\n      }\n      codeLink\n      status\n      issueDate\n      expiryDate\n      updatedAt\n      createdAt\n    }\n  }\n': typeof types.IdentityCardInfoDocument;
  '\n  mutation CreatePrintSession($identityCardIds: [ID!]!, $provinceId: ID!) {\n    createPrintSession(identityCardIds: $identityCardIds, provinceId: $provinceId) {\n      id\n      name\n      status\n      createdAt\n    }\n  }\n': typeof types.CreatePrintSessionDocument;
  '\n  query IdentityCardScanLogs($identityCardId: ID!, $limit: Int) {\n    identityCard(id: $identityCardId) {\n      id\n      scanAudits(limit: $limit) {\n        nodes {\n          id\n          scannedBy {\n            id\n            fullName\n          }\n          latitude\n          longitude\n          createdAt\n          card {\n            id\n            cardNumber\n          }\n        }\n        pageInfo {\n          cursor\n          hasNextPage\n          totalCount\n        }\n      }\n    }\n  }\n': typeof types.IdentityCardScanLogsDocument;
  '\n  query IdentityCard($identityCardId: ID!) {\n    identityCard(id: $identityCardId) {\n      id\n      cardNumber\n    }\n  }\n': typeof types.IdentityCardDocument;
  '\n  query IdentityCardUserQuery($id: ID!) {\n    user(id: $id) {\n      id\n      documents {\n        id\n        type\n        name\n        description\n        file\n      }\n    }\n  }\n': typeof types.IdentityCardUserQueryDocument;
  '\n  query IdentityCardUser($id: ID!) {\n    identityCard(id: $id) {\n      id\n      user {\n        id\n        fullName\n        firstName\n        middleName\n        lastName\n        email\n        phoneNumber\n        gender\n        dateOfBirth\n        category\n        photo\n        province {\n          name\n          shortName\n          logo\n        }\n        address {\n          line1\n          line2\n          city\n          state\n          country\n        }\n        createdAt\n      }\n      cardNumber\n      issueDate\n      expiryDate\n    }\n  }\n': typeof types.IdentityCardUserDocument;
  '\n  query PrintSession($id: ID!) {\n    printSession(id: $id) {\n      id\n      name\n      status\n      createdAt\n      province {\n        id\n        name\n      }\n      identityCards {\n        id\n        cardNumber\n        user {\n          id\n          firstName\n          lastName\n          gender\n          dateOfBirth\n          category\n          province {\n            id\n            name\n          }\n          nationality\n          provinceOfOrigin\n          photo\n          address {\n            line1\n            city\n          }\n        }\n        codeLink\n        status\n        issueDate\n        expiryDate\n        updatedAt\n        createdAt\n      }\n    }\n  }\n': typeof types.PrintSessionDocument;
  '\n  mutation MarkPrintSessionAsPrinted($id: ID!) {\n    markPrintSessionAsPrinted(id: $id) {\n      id\n      status\n    }\n  }\n': typeof types.MarkPrintSessionAsPrintedDocument;
  '\n  mutation MarkPrintSessionAsCancelled($id: ID!) {\n    markPrintSessionAsCancelled(id: $id) {\n      id\n      status\n    }\n  }\n': typeof types.MarkPrintSessionAsCancelledDocument;
  '\n  mutation CreateDocument(\n    $userId: ID!\n    $name: String!\n    $description: String\n    $type: DocumentTypeEnumType!\n    $file: Upload!\n  ) {\n    createDocument(\n      userId: $userId\n      name: $name\n      description: $description\n      type: $type\n      file: $file\n    ) {\n      id\n      name\n      description\n      type\n      file\n      status\n      createdAt\n      updatedAt\n    }\n  }\n': typeof types.CreateDocumentDocument;
  '\n                fragment NewDocument on DocumentType {\n                  id\n                  name\n                  description\n                  type\n                  file\n                  status\n                  updatedAt\n                  createdAt\n                }\n              ': typeof types.NewDocumentFragmentDoc;
  '\n  query UserDocuments($userId: ID!) {\n    user(id: $userId) {\n      id\n      documents {\n        id\n        type\n        name\n        description\n        file\n        status\n        createdAt\n      }\n    }\n  }\n': typeof types.UserDocumentsDocument;
  '\n  mutation CreateIdentityCard(\n    $userId: ID!\n    $cardNumber: String!\n    $issueDate: String!\n    $expiryDate: String!\n  ) {\n    createIdentityCard(\n      userId: $userId\n      cardNumber: $cardNumber\n      issueDate: $issueDate\n      expiryDate: $expiryDate\n    ) {\n      id\n      cardNumber\n      issueDate\n      expiryDate\n      createdAt\n      updatedAt\n    }\n  }\n': typeof types.CreateIdentityCardDocument;
  '\n                fragment NewIdentityCard on IdentityCardType {\n                  id\n                  cardNumber\n                  issueDate\n                  expiryDate\n                  status\n                  updatedAt\n                  createdAt\n                }\n              ': typeof types.NewIdentityCardFragmentDoc;
  '\n  query IdentityCards($userId: ID!) {\n    user(id: $userId) {\n      id\n      identityCards {\n        id\n        cardNumber\n        status\n        issueDate\n        expiryDate\n        createdAt\n      }\n    }\n  }\n': typeof types.IdentityCardsDocument;
  '\n  mutation RemoveUser($id: ID!) {\n    removeUser(id: $id) {\n      id\n    }\n  }\n': typeof types.RemoveUserDocument;
  '\n  mutation UpdateAddress(\n    $id: ID!\n    $line1: String!\n    $line2: String\n    $city: String!\n    $postalCode: String!\n    $state: String!\n    $country: String!\n  ) {\n    updateAddress(\n      id: $id\n      line1: $line1\n      line2: $line2\n      city: $city\n      postalCode: $postalCode\n      state: $state\n      country: $country\n    ) {\n      id\n      line1\n      line2\n      city\n      state\n      postalCode\n      country\n    }\n  }\n': typeof types.UpdateAddressDocument;
  '\n  mutation UpdateUser(\n    $id: ID!\n    $firstName: String!\n    $lastName: String!\n    $email: String\n    $phoneNumber: String!\n    $dateOfBirth: String!\n    $gender: GenderEnumType!\n    $nationality: NationalityEnumType!\n    $provinceOfOrigin: String\n    $category: CategoryEnumType!\n    $photo: Upload\n  ) {\n    updateUser(\n      id: $id\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      phoneNumber: $phoneNumber\n      gender: $gender\n      dateOfBirth: $dateOfBirth\n      nationality: $nationality\n      category: $category\n      provinceOfOrigin: $provinceOfOrigin\n      photo: $photo\n    ) {\n      id\n      firstName\n      lastName\n      email\n      phoneNumber\n      gender\n      dateOfBirth\n      nationality\n      category\n      provinceOfOrigin\n      photo\n    }\n  }\n': typeof types.UpdateUserDocument;
  '\n  mutation UpdateUserStatus($id: ID!, $status: UserStatusEnumType!) {\n    updateUserStatus(id: $id, status: $status) {\n      id\n      status\n      updatedAt\n    }\n  }\n': typeof types.UpdateUserStatusDocument;
  '\n  query UserInformation($userId: ID!) {\n    user(id: $userId) {\n      id\n      firstName\n      lastName\n      fullName\n      email\n      phoneNumber\n      status\n      category\n      nationality\n      provinceOfOrigin\n      gender\n      dateOfBirth\n      photo\n      province {\n        id\n        name\n      }\n      address {\n        id\n        line1\n        line2\n        city\n        state\n        postalCode\n        country\n      }\n      createdAt\n    }\n  }\n': typeof types.UserInformationDocument;
  '\n  query getUser($userId: ID!) {\n    user(id: $userId) {\n      id\n      fullName\n    }\n  }\n': typeof types.GetUserDocument;
  '\n  query AdministrationUsers($limit: Int, $cursor: ID, $filters: UserFilterInputType) {\n    users(limit: $limit, cursor: $cursor, filters: $filters) {\n      nodes {\n        id\n        fullName\n        category\n        province {\n          id\n          name\n        }\n        status\n        createdAt\n      }\n      pageInfo {\n        cursor\n        totalCount\n        hasNextPage\n      }\n    }\n  }\n': typeof types.AdministrationUsersDocument;
};
const documents: Documents = {
  '\n  fragment UserFragmentCreateUserNew on UserType {\n    id\n    province {\n      id\n      name\n    }\n    firstName\n    lastName\n    fullName\n    gender\n    dateOfBirth\n    nationality\n    provinceOfOrigin\n    address {\n      line1\n      line2\n      city\n      state\n      postalCode\n      country\n    }\n  }\n':
    types.UserFragmentCreateUserNewFragmentDoc,
  '\n  \n  mutation CreateUser(\n    $provinceId: ID!\n    $firstName: String!\n    $lastName: String!\n    $gender: GenderEnumType!\n    $dateOfBirth: String!\n    $nationality: NationalityEnumType!\n    $provinceOfOrigin: String\n    $category: CategoryEnumType!\n    $photo: Upload\n    $line1: String!\n    $line2: String\n    $city: String!\n    $state: String!\n    $country: String!\n    $postalCode: String!\n  ) {\n    createUser(\n      provinceId: $provinceId\n      firstName: $firstName\n      lastName: $lastName\n      gender: $gender\n      dateOfBirth: $dateOfBirth\n      nationality: $nationality\n      provinceOfOrigin: $provinceOfOrigin\n      category: $category\n      photo: $photo\n      line1: $line1\n      line2: $line2\n      city: $city\n      state: $state\n      country: $country\n      postalCode: $postalCode\n    ) {\n      ...UserFragmentCreateUserNew\n    }\n  }\n':
    types.CreateUserDocument,
  '\n  query ProvincesNew {\n    provinces {\n      id\n      name\n    }\n  }\n':
    types.ProvincesNewDocument,
  '\n  mutation UpdateIdentityCardStatus($id: ID!, $status: IdentityCardStatusEnumType!) {\n    updateIdentityCardStatus(id: $id, status: $status) {\n      id\n      status\n      updatedAt\n    }\n  }\n':
    types.UpdateIdentityCardStatusDocument,
  '\n  query IdentityCardInfo($id: ID!) {\n    identityCard(id: $id) {\n      id\n      cardNumber\n      user {\n        id\n        firstName\n        lastName\n        gender\n        nationality\n        province {\n          id\n          name\n        }\n        photo\n      }\n      codeLink\n      status\n      issueDate\n      expiryDate\n      updatedAt\n      createdAt\n    }\n  }\n':
    types.IdentityCardInfoDocument,
  '\n  mutation CreatePrintSession($identityCardIds: [ID!]!, $provinceId: ID!) {\n    createPrintSession(identityCardIds: $identityCardIds, provinceId: $provinceId) {\n      id\n      name\n      status\n      createdAt\n    }\n  }\n':
    types.CreatePrintSessionDocument,
  '\n  query IdentityCardScanLogs($identityCardId: ID!, $limit: Int) {\n    identityCard(id: $identityCardId) {\n      id\n      scanAudits(limit: $limit) {\n        nodes {\n          id\n          scannedBy {\n            id\n            fullName\n          }\n          latitude\n          longitude\n          createdAt\n          card {\n            id\n            cardNumber\n          }\n        }\n        pageInfo {\n          cursor\n          hasNextPage\n          totalCount\n        }\n      }\n    }\n  }\n':
    types.IdentityCardScanLogsDocument,
  '\n  query IdentityCard($identityCardId: ID!) {\n    identityCard(id: $identityCardId) {\n      id\n      cardNumber\n    }\n  }\n':
    types.IdentityCardDocument,
  '\n  query IdentityCardUserQuery($id: ID!) {\n    user(id: $id) {\n      id\n      documents {\n        id\n        type\n        name\n        description\n        file\n      }\n    }\n  }\n':
    types.IdentityCardUserQueryDocument,
  '\n  query IdentityCardUser($id: ID!) {\n    identityCard(id: $id) {\n      id\n      user {\n        id\n        fullName\n        firstName\n        middleName\n        lastName\n        email\n        phoneNumber\n        gender\n        dateOfBirth\n        category\n        photo\n        province {\n          name\n          shortName\n          logo\n        }\n        address {\n          line1\n          line2\n          city\n          state\n          country\n        }\n        createdAt\n      }\n      cardNumber\n      issueDate\n      expiryDate\n    }\n  }\n':
    types.IdentityCardUserDocument,
  '\n  query PrintSession($id: ID!) {\n    printSession(id: $id) {\n      id\n      name\n      status\n      createdAt\n      province {\n        id\n        name\n      }\n      identityCards {\n        id\n        cardNumber\n        user {\n          id\n          firstName\n          lastName\n          gender\n          dateOfBirth\n          category\n          province {\n            id\n            name\n          }\n          nationality\n          provinceOfOrigin\n          photo\n          address {\n            line1\n            city\n          }\n        }\n        codeLink\n        status\n        issueDate\n        expiryDate\n        updatedAt\n        createdAt\n      }\n    }\n  }\n':
    types.PrintSessionDocument,
  '\n  mutation MarkPrintSessionAsPrinted($id: ID!) {\n    markPrintSessionAsPrinted(id: $id) {\n      id\n      status\n    }\n  }\n':
    types.MarkPrintSessionAsPrintedDocument,
  '\n  mutation MarkPrintSessionAsCancelled($id: ID!) {\n    markPrintSessionAsCancelled(id: $id) {\n      id\n      status\n    }\n  }\n':
    types.MarkPrintSessionAsCancelledDocument,
  '\n  mutation CreateDocument(\n    $userId: ID!\n    $name: String!\n    $description: String\n    $type: DocumentTypeEnumType!\n    $file: Upload!\n  ) {\n    createDocument(\n      userId: $userId\n      name: $name\n      description: $description\n      type: $type\n      file: $file\n    ) {\n      id\n      name\n      description\n      type\n      file\n      status\n      createdAt\n      updatedAt\n    }\n  }\n':
    types.CreateDocumentDocument,
  '\n                fragment NewDocument on DocumentType {\n                  id\n                  name\n                  description\n                  type\n                  file\n                  status\n                  updatedAt\n                  createdAt\n                }\n              ':
    types.NewDocumentFragmentDoc,
  '\n  query UserDocuments($userId: ID!) {\n    user(id: $userId) {\n      id\n      documents {\n        id\n        type\n        name\n        description\n        file\n        status\n        createdAt\n      }\n    }\n  }\n':
    types.UserDocumentsDocument,
  '\n  mutation CreateIdentityCard(\n    $userId: ID!\n    $cardNumber: String!\n    $issueDate: String!\n    $expiryDate: String!\n  ) {\n    createIdentityCard(\n      userId: $userId\n      cardNumber: $cardNumber\n      issueDate: $issueDate\n      expiryDate: $expiryDate\n    ) {\n      id\n      cardNumber\n      issueDate\n      expiryDate\n      createdAt\n      updatedAt\n    }\n  }\n':
    types.CreateIdentityCardDocument,
  '\n                fragment NewIdentityCard on IdentityCardType {\n                  id\n                  cardNumber\n                  issueDate\n                  expiryDate\n                  status\n                  updatedAt\n                  createdAt\n                }\n              ':
    types.NewIdentityCardFragmentDoc,
  '\n  query IdentityCards($userId: ID!) {\n    user(id: $userId) {\n      id\n      identityCards {\n        id\n        cardNumber\n        status\n        issueDate\n        expiryDate\n        createdAt\n      }\n    }\n  }\n':
    types.IdentityCardsDocument,
  '\n  mutation RemoveUser($id: ID!) {\n    removeUser(id: $id) {\n      id\n    }\n  }\n':
    types.RemoveUserDocument,
  '\n  mutation UpdateAddress(\n    $id: ID!\n    $line1: String!\n    $line2: String\n    $city: String!\n    $postalCode: String!\n    $state: String!\n    $country: String!\n  ) {\n    updateAddress(\n      id: $id\n      line1: $line1\n      line2: $line2\n      city: $city\n      postalCode: $postalCode\n      state: $state\n      country: $country\n    ) {\n      id\n      line1\n      line2\n      city\n      state\n      postalCode\n      country\n    }\n  }\n':
    types.UpdateAddressDocument,
  '\n  mutation UpdateUser(\n    $id: ID!\n    $firstName: String!\n    $lastName: String!\n    $email: String\n    $phoneNumber: String!\n    $dateOfBirth: String!\n    $gender: GenderEnumType!\n    $nationality: NationalityEnumType!\n    $provinceOfOrigin: String\n    $category: CategoryEnumType!\n    $photo: Upload\n  ) {\n    updateUser(\n      id: $id\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      phoneNumber: $phoneNumber\n      gender: $gender\n      dateOfBirth: $dateOfBirth\n      nationality: $nationality\n      category: $category\n      provinceOfOrigin: $provinceOfOrigin\n      photo: $photo\n    ) {\n      id\n      firstName\n      lastName\n      email\n      phoneNumber\n      gender\n      dateOfBirth\n      nationality\n      category\n      provinceOfOrigin\n      photo\n    }\n  }\n':
    types.UpdateUserDocument,
  '\n  mutation UpdateUserStatus($id: ID!, $status: UserStatusEnumType!) {\n    updateUserStatus(id: $id, status: $status) {\n      id\n      status\n      updatedAt\n    }\n  }\n':
    types.UpdateUserStatusDocument,
  '\n  query UserInformation($userId: ID!) {\n    user(id: $userId) {\n      id\n      firstName\n      lastName\n      fullName\n      email\n      phoneNumber\n      status\n      category\n      nationality\n      provinceOfOrigin\n      gender\n      dateOfBirth\n      photo\n      province {\n        id\n        name\n      }\n      address {\n        id\n        line1\n        line2\n        city\n        state\n        postalCode\n        country\n      }\n      createdAt\n    }\n  }\n':
    types.UserInformationDocument,
  '\n  query getUser($userId: ID!) {\n    user(id: $userId) {\n      id\n      fullName\n    }\n  }\n':
    types.GetUserDocument,
  '\n  query AdministrationUsers($limit: Int, $cursor: ID, $filters: UserFilterInputType) {\n    users(limit: $limit, cursor: $cursor, filters: $filters) {\n      nodes {\n        id\n        fullName\n        category\n        province {\n          id\n          name\n        }\n        status\n        createdAt\n      }\n      pageInfo {\n        cursor\n        totalCount\n        hasNextPage\n      }\n    }\n  }\n':
    types.AdministrationUsersDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment UserFragmentCreateUserNew on UserType {\n    id\n    province {\n      id\n      name\n    }\n    firstName\n    lastName\n    fullName\n    gender\n    dateOfBirth\n    nationality\n    provinceOfOrigin\n    address {\n      line1\n      line2\n      city\n      state\n      postalCode\n      country\n    }\n  }\n'
): (typeof documents)['\n  fragment UserFragmentCreateUserNew on UserType {\n    id\n    province {\n      id\n      name\n    }\n    firstName\n    lastName\n    fullName\n    gender\n    dateOfBirth\n    nationality\n    provinceOfOrigin\n    address {\n      line1\n      line2\n      city\n      state\n      postalCode\n      country\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  \n  mutation CreateUser(\n    $provinceId: ID!\n    $firstName: String!\n    $lastName: String!\n    $gender: GenderEnumType!\n    $dateOfBirth: String!\n    $nationality: NationalityEnumType!\n    $provinceOfOrigin: String\n    $category: CategoryEnumType!\n    $photo: Upload\n    $line1: String!\n    $line2: String\n    $city: String!\n    $state: String!\n    $country: String!\n    $postalCode: String!\n  ) {\n    createUser(\n      provinceId: $provinceId\n      firstName: $firstName\n      lastName: $lastName\n      gender: $gender\n      dateOfBirth: $dateOfBirth\n      nationality: $nationality\n      provinceOfOrigin: $provinceOfOrigin\n      category: $category\n      photo: $photo\n      line1: $line1\n      line2: $line2\n      city: $city\n      state: $state\n      country: $country\n      postalCode: $postalCode\n    ) {\n      ...UserFragmentCreateUserNew\n    }\n  }\n'
): (typeof documents)['\n  \n  mutation CreateUser(\n    $provinceId: ID!\n    $firstName: String!\n    $lastName: String!\n    $gender: GenderEnumType!\n    $dateOfBirth: String!\n    $nationality: NationalityEnumType!\n    $provinceOfOrigin: String\n    $category: CategoryEnumType!\n    $photo: Upload\n    $line1: String!\n    $line2: String\n    $city: String!\n    $state: String!\n    $country: String!\n    $postalCode: String!\n  ) {\n    createUser(\n      provinceId: $provinceId\n      firstName: $firstName\n      lastName: $lastName\n      gender: $gender\n      dateOfBirth: $dateOfBirth\n      nationality: $nationality\n      provinceOfOrigin: $provinceOfOrigin\n      category: $category\n      photo: $photo\n      line1: $line1\n      line2: $line2\n      city: $city\n      state: $state\n      country: $country\n      postalCode: $postalCode\n    ) {\n      ...UserFragmentCreateUserNew\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ProvincesNew {\n    provinces {\n      id\n      name\n    }\n  }\n'
): (typeof documents)['\n  query ProvincesNew {\n    provinces {\n      id\n      name\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation UpdateIdentityCardStatus($id: ID!, $status: IdentityCardStatusEnumType!) {\n    updateIdentityCardStatus(id: $id, status: $status) {\n      id\n      status\n      updatedAt\n    }\n  }\n'
): (typeof documents)['\n  mutation UpdateIdentityCardStatus($id: ID!, $status: IdentityCardStatusEnumType!) {\n    updateIdentityCardStatus(id: $id, status: $status) {\n      id\n      status\n      updatedAt\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query IdentityCardInfo($id: ID!) {\n    identityCard(id: $id) {\n      id\n      cardNumber\n      user {\n        id\n        firstName\n        lastName\n        gender\n        nationality\n        province {\n          id\n          name\n        }\n        photo\n      }\n      codeLink\n      status\n      issueDate\n      expiryDate\n      updatedAt\n      createdAt\n    }\n  }\n'
): (typeof documents)['\n  query IdentityCardInfo($id: ID!) {\n    identityCard(id: $id) {\n      id\n      cardNumber\n      user {\n        id\n        firstName\n        lastName\n        gender\n        nationality\n        province {\n          id\n          name\n        }\n        photo\n      }\n      codeLink\n      status\n      issueDate\n      expiryDate\n      updatedAt\n      createdAt\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation CreatePrintSession($identityCardIds: [ID!]!, $provinceId: ID!) {\n    createPrintSession(identityCardIds: $identityCardIds, provinceId: $provinceId) {\n      id\n      name\n      status\n      createdAt\n    }\n  }\n'
): (typeof documents)['\n  mutation CreatePrintSession($identityCardIds: [ID!]!, $provinceId: ID!) {\n    createPrintSession(identityCardIds: $identityCardIds, provinceId: $provinceId) {\n      id\n      name\n      status\n      createdAt\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query IdentityCardScanLogs($identityCardId: ID!, $limit: Int) {\n    identityCard(id: $identityCardId) {\n      id\n      scanAudits(limit: $limit) {\n        nodes {\n          id\n          scannedBy {\n            id\n            fullName\n          }\n          latitude\n          longitude\n          createdAt\n          card {\n            id\n            cardNumber\n          }\n        }\n        pageInfo {\n          cursor\n          hasNextPage\n          totalCount\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query IdentityCardScanLogs($identityCardId: ID!, $limit: Int) {\n    identityCard(id: $identityCardId) {\n      id\n      scanAudits(limit: $limit) {\n        nodes {\n          id\n          scannedBy {\n            id\n            fullName\n          }\n          latitude\n          longitude\n          createdAt\n          card {\n            id\n            cardNumber\n          }\n        }\n        pageInfo {\n          cursor\n          hasNextPage\n          totalCount\n        }\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query IdentityCard($identityCardId: ID!) {\n    identityCard(id: $identityCardId) {\n      id\n      cardNumber\n    }\n  }\n'
): (typeof documents)['\n  query IdentityCard($identityCardId: ID!) {\n    identityCard(id: $identityCardId) {\n      id\n      cardNumber\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query IdentityCardUserQuery($id: ID!) {\n    user(id: $id) {\n      id\n      documents {\n        id\n        type\n        name\n        description\n        file\n      }\n    }\n  }\n'
): (typeof documents)['\n  query IdentityCardUserQuery($id: ID!) {\n    user(id: $id) {\n      id\n      documents {\n        id\n        type\n        name\n        description\n        file\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query IdentityCardUser($id: ID!) {\n    identityCard(id: $id) {\n      id\n      user {\n        id\n        fullName\n        firstName\n        middleName\n        lastName\n        email\n        phoneNumber\n        gender\n        dateOfBirth\n        category\n        photo\n        province {\n          name\n          shortName\n          logo\n        }\n        address {\n          line1\n          line2\n          city\n          state\n          country\n        }\n        createdAt\n      }\n      cardNumber\n      issueDate\n      expiryDate\n    }\n  }\n'
): (typeof documents)['\n  query IdentityCardUser($id: ID!) {\n    identityCard(id: $id) {\n      id\n      user {\n        id\n        fullName\n        firstName\n        middleName\n        lastName\n        email\n        phoneNumber\n        gender\n        dateOfBirth\n        category\n        photo\n        province {\n          name\n          shortName\n          logo\n        }\n        address {\n          line1\n          line2\n          city\n          state\n          country\n        }\n        createdAt\n      }\n      cardNumber\n      issueDate\n      expiryDate\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query PrintSession($id: ID!) {\n    printSession(id: $id) {\n      id\n      name\n      status\n      createdAt\n      province {\n        id\n        name\n      }\n      identityCards {\n        id\n        cardNumber\n        user {\n          id\n          firstName\n          lastName\n          gender\n          dateOfBirth\n          category\n          province {\n            id\n            name\n          }\n          nationality\n          provinceOfOrigin\n          photo\n          address {\n            line1\n            city\n          }\n        }\n        codeLink\n        status\n        issueDate\n        expiryDate\n        updatedAt\n        createdAt\n      }\n    }\n  }\n'
): (typeof documents)['\n  query PrintSession($id: ID!) {\n    printSession(id: $id) {\n      id\n      name\n      status\n      createdAt\n      province {\n        id\n        name\n      }\n      identityCards {\n        id\n        cardNumber\n        user {\n          id\n          firstName\n          lastName\n          gender\n          dateOfBirth\n          category\n          province {\n            id\n            name\n          }\n          nationality\n          provinceOfOrigin\n          photo\n          address {\n            line1\n            city\n          }\n        }\n        codeLink\n        status\n        issueDate\n        expiryDate\n        updatedAt\n        createdAt\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation MarkPrintSessionAsPrinted($id: ID!) {\n    markPrintSessionAsPrinted(id: $id) {\n      id\n      status\n    }\n  }\n'
): (typeof documents)['\n  mutation MarkPrintSessionAsPrinted($id: ID!) {\n    markPrintSessionAsPrinted(id: $id) {\n      id\n      status\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation MarkPrintSessionAsCancelled($id: ID!) {\n    markPrintSessionAsCancelled(id: $id) {\n      id\n      status\n    }\n  }\n'
): (typeof documents)['\n  mutation MarkPrintSessionAsCancelled($id: ID!) {\n    markPrintSessionAsCancelled(id: $id) {\n      id\n      status\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation CreateDocument(\n    $userId: ID!\n    $name: String!\n    $description: String\n    $type: DocumentTypeEnumType!\n    $file: Upload!\n  ) {\n    createDocument(\n      userId: $userId\n      name: $name\n      description: $description\n      type: $type\n      file: $file\n    ) {\n      id\n      name\n      description\n      type\n      file\n      status\n      createdAt\n      updatedAt\n    }\n  }\n'
): (typeof documents)['\n  mutation CreateDocument(\n    $userId: ID!\n    $name: String!\n    $description: String\n    $type: DocumentTypeEnumType!\n    $file: Upload!\n  ) {\n    createDocument(\n      userId: $userId\n      name: $name\n      description: $description\n      type: $type\n      file: $file\n    ) {\n      id\n      name\n      description\n      type\n      file\n      status\n      createdAt\n      updatedAt\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n                fragment NewDocument on DocumentType {\n                  id\n                  name\n                  description\n                  type\n                  file\n                  status\n                  updatedAt\n                  createdAt\n                }\n              '
): (typeof documents)['\n                fragment NewDocument on DocumentType {\n                  id\n                  name\n                  description\n                  type\n                  file\n                  status\n                  updatedAt\n                  createdAt\n                }\n              '];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query UserDocuments($userId: ID!) {\n    user(id: $userId) {\n      id\n      documents {\n        id\n        type\n        name\n        description\n        file\n        status\n        createdAt\n      }\n    }\n  }\n'
): (typeof documents)['\n  query UserDocuments($userId: ID!) {\n    user(id: $userId) {\n      id\n      documents {\n        id\n        type\n        name\n        description\n        file\n        status\n        createdAt\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation CreateIdentityCard(\n    $userId: ID!\n    $cardNumber: String!\n    $issueDate: String!\n    $expiryDate: String!\n  ) {\n    createIdentityCard(\n      userId: $userId\n      cardNumber: $cardNumber\n      issueDate: $issueDate\n      expiryDate: $expiryDate\n    ) {\n      id\n      cardNumber\n      issueDate\n      expiryDate\n      createdAt\n      updatedAt\n    }\n  }\n'
): (typeof documents)['\n  mutation CreateIdentityCard(\n    $userId: ID!\n    $cardNumber: String!\n    $issueDate: String!\n    $expiryDate: String!\n  ) {\n    createIdentityCard(\n      userId: $userId\n      cardNumber: $cardNumber\n      issueDate: $issueDate\n      expiryDate: $expiryDate\n    ) {\n      id\n      cardNumber\n      issueDate\n      expiryDate\n      createdAt\n      updatedAt\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n                fragment NewIdentityCard on IdentityCardType {\n                  id\n                  cardNumber\n                  issueDate\n                  expiryDate\n                  status\n                  updatedAt\n                  createdAt\n                }\n              '
): (typeof documents)['\n                fragment NewIdentityCard on IdentityCardType {\n                  id\n                  cardNumber\n                  issueDate\n                  expiryDate\n                  status\n                  updatedAt\n                  createdAt\n                }\n              '];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query IdentityCards($userId: ID!) {\n    user(id: $userId) {\n      id\n      identityCards {\n        id\n        cardNumber\n        status\n        issueDate\n        expiryDate\n        createdAt\n      }\n    }\n  }\n'
): (typeof documents)['\n  query IdentityCards($userId: ID!) {\n    user(id: $userId) {\n      id\n      identityCards {\n        id\n        cardNumber\n        status\n        issueDate\n        expiryDate\n        createdAt\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation RemoveUser($id: ID!) {\n    removeUser(id: $id) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation RemoveUser($id: ID!) {\n    removeUser(id: $id) {\n      id\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation UpdateAddress(\n    $id: ID!\n    $line1: String!\n    $line2: String\n    $city: String!\n    $postalCode: String!\n    $state: String!\n    $country: String!\n  ) {\n    updateAddress(\n      id: $id\n      line1: $line1\n      line2: $line2\n      city: $city\n      postalCode: $postalCode\n      state: $state\n      country: $country\n    ) {\n      id\n      line1\n      line2\n      city\n      state\n      postalCode\n      country\n    }\n  }\n'
): (typeof documents)['\n  mutation UpdateAddress(\n    $id: ID!\n    $line1: String!\n    $line2: String\n    $city: String!\n    $postalCode: String!\n    $state: String!\n    $country: String!\n  ) {\n    updateAddress(\n      id: $id\n      line1: $line1\n      line2: $line2\n      city: $city\n      postalCode: $postalCode\n      state: $state\n      country: $country\n    ) {\n      id\n      line1\n      line2\n      city\n      state\n      postalCode\n      country\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation UpdateUser(\n    $id: ID!\n    $firstName: String!\n    $lastName: String!\n    $email: String\n    $phoneNumber: String!\n    $dateOfBirth: String!\n    $gender: GenderEnumType!\n    $nationality: NationalityEnumType!\n    $provinceOfOrigin: String\n    $category: CategoryEnumType!\n    $photo: Upload\n  ) {\n    updateUser(\n      id: $id\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      phoneNumber: $phoneNumber\n      gender: $gender\n      dateOfBirth: $dateOfBirth\n      nationality: $nationality\n      category: $category\n      provinceOfOrigin: $provinceOfOrigin\n      photo: $photo\n    ) {\n      id\n      firstName\n      lastName\n      email\n      phoneNumber\n      gender\n      dateOfBirth\n      nationality\n      category\n      provinceOfOrigin\n      photo\n    }\n  }\n'
): (typeof documents)['\n  mutation UpdateUser(\n    $id: ID!\n    $firstName: String!\n    $lastName: String!\n    $email: String\n    $phoneNumber: String!\n    $dateOfBirth: String!\n    $gender: GenderEnumType!\n    $nationality: NationalityEnumType!\n    $provinceOfOrigin: String\n    $category: CategoryEnumType!\n    $photo: Upload\n  ) {\n    updateUser(\n      id: $id\n      firstName: $firstName\n      lastName: $lastName\n      email: $email\n      phoneNumber: $phoneNumber\n      gender: $gender\n      dateOfBirth: $dateOfBirth\n      nationality: $nationality\n      category: $category\n      provinceOfOrigin: $provinceOfOrigin\n      photo: $photo\n    ) {\n      id\n      firstName\n      lastName\n      email\n      phoneNumber\n      gender\n      dateOfBirth\n      nationality\n      category\n      provinceOfOrigin\n      photo\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation UpdateUserStatus($id: ID!, $status: UserStatusEnumType!) {\n    updateUserStatus(id: $id, status: $status) {\n      id\n      status\n      updatedAt\n    }\n  }\n'
): (typeof documents)['\n  mutation UpdateUserStatus($id: ID!, $status: UserStatusEnumType!) {\n    updateUserStatus(id: $id, status: $status) {\n      id\n      status\n      updatedAt\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query UserInformation($userId: ID!) {\n    user(id: $userId) {\n      id\n      firstName\n      lastName\n      fullName\n      email\n      phoneNumber\n      status\n      category\n      nationality\n      provinceOfOrigin\n      gender\n      dateOfBirth\n      photo\n      province {\n        id\n        name\n      }\n      address {\n        id\n        line1\n        line2\n        city\n        state\n        postalCode\n        country\n      }\n      createdAt\n    }\n  }\n'
): (typeof documents)['\n  query UserInformation($userId: ID!) {\n    user(id: $userId) {\n      id\n      firstName\n      lastName\n      fullName\n      email\n      phoneNumber\n      status\n      category\n      nationality\n      provinceOfOrigin\n      gender\n      dateOfBirth\n      photo\n      province {\n        id\n        name\n      }\n      address {\n        id\n        line1\n        line2\n        city\n        state\n        postalCode\n        country\n      }\n      createdAt\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query getUser($userId: ID!) {\n    user(id: $userId) {\n      id\n      fullName\n    }\n  }\n'
): (typeof documents)['\n  query getUser($userId: ID!) {\n    user(id: $userId) {\n      id\n      fullName\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query AdministrationUsers($limit: Int, $cursor: ID, $filters: UserFilterInputType) {\n    users(limit: $limit, cursor: $cursor, filters: $filters) {\n      nodes {\n        id\n        fullName\n        category\n        province {\n          id\n          name\n        }\n        status\n        createdAt\n      }\n      pageInfo {\n        cursor\n        totalCount\n        hasNextPage\n      }\n    }\n  }\n'
): (typeof documents)['\n  query AdministrationUsers($limit: Int, $cursor: ID, $filters: UserFilterInputType) {\n    users(limit: $limit, cursor: $cursor, filters: $filters) {\n      nodes {\n        id\n        fullName\n        category\n        province {\n          id\n          name\n        }\n        status\n        createdAt\n      }\n      pageInfo {\n        cursor\n        totalCount\n        hasNextPage\n      }\n    }\n  }\n'];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
