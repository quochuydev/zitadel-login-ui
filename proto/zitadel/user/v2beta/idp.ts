/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Struct } from "../../../google/protobuf/struct";

export const protobufPackage = "zitadel.user.v2beta";

export interface LDAPCredentials {
  username: string;
  password: string;
}

export interface RedirectURLs {
  successUrl: string;
  failureUrl: string;
}

export interface IDPIntent {
  idpIntentId: string;
  idpIntentToken: string;
}

export interface IDPInformation {
  oauth?: IDPOAuthAccessInformation | undefined;
  ldap?: IDPLDAPAccessInformation | undefined;
  idpId: string;
  userId: string;
  userName: string;
  rawInformation: { [key: string]: any } | undefined;
}

export interface IDPOAuthAccessInformation {
  accessToken: string;
  idToken?: string | undefined;
}

export interface IDPLDAPAccessInformation {
  attributes: { [key: string]: any } | undefined;
}

export interface IDPLink {
  idpId: string;
  userId: string;
  userName: string;
}

function createBaseLDAPCredentials(): LDAPCredentials {
  return { username: "", password: "" };
}

export const LDAPCredentials = {
  encode(message: LDAPCredentials, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.username !== "") {
      writer.uint32(10).string(message.username);
    }
    if (message.password !== "") {
      writer.uint32(18).string(message.password);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LDAPCredentials {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLDAPCredentials();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.username = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.password = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): LDAPCredentials {
    return {
      username: isSet(object.username) ? String(object.username) : "",
      password: isSet(object.password) ? String(object.password) : "",
    };
  },

  toJSON(message: LDAPCredentials): unknown {
    const obj: any = {};
    if (message.username !== "") {
      obj.username = message.username;
    }
    if (message.password !== "") {
      obj.password = message.password;
    }
    return obj;
  },

  create(base?: DeepPartial<LDAPCredentials>): LDAPCredentials {
    return LDAPCredentials.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<LDAPCredentials>): LDAPCredentials {
    const message = createBaseLDAPCredentials();
    message.username = object.username ?? "";
    message.password = object.password ?? "";
    return message;
  },
};

function createBaseRedirectURLs(): RedirectURLs {
  return { successUrl: "", failureUrl: "" };
}

export const RedirectURLs = {
  encode(message: RedirectURLs, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.successUrl !== "") {
      writer.uint32(10).string(message.successUrl);
    }
    if (message.failureUrl !== "") {
      writer.uint32(18).string(message.failureUrl);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RedirectURLs {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRedirectURLs();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.successUrl = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.failureUrl = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RedirectURLs {
    return {
      successUrl: isSet(object.successUrl) ? String(object.successUrl) : "",
      failureUrl: isSet(object.failureUrl) ? String(object.failureUrl) : "",
    };
  },

  toJSON(message: RedirectURLs): unknown {
    const obj: any = {};
    if (message.successUrl !== "") {
      obj.successUrl = message.successUrl;
    }
    if (message.failureUrl !== "") {
      obj.failureUrl = message.failureUrl;
    }
    return obj;
  },

  create(base?: DeepPartial<RedirectURLs>): RedirectURLs {
    return RedirectURLs.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<RedirectURLs>): RedirectURLs {
    const message = createBaseRedirectURLs();
    message.successUrl = object.successUrl ?? "";
    message.failureUrl = object.failureUrl ?? "";
    return message;
  },
};

function createBaseIDPIntent(): IDPIntent {
  return { idpIntentId: "", idpIntentToken: "" };
}

export const IDPIntent = {
  encode(message: IDPIntent, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.idpIntentId !== "") {
      writer.uint32(10).string(message.idpIntentId);
    }
    if (message.idpIntentToken !== "") {
      writer.uint32(18).string(message.idpIntentToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IDPIntent {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIDPIntent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.idpIntentId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.idpIntentToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IDPIntent {
    return {
      idpIntentId: isSet(object.idpIntentId) ? String(object.idpIntentId) : "",
      idpIntentToken: isSet(object.idpIntentToken) ? String(object.idpIntentToken) : "",
    };
  },

  toJSON(message: IDPIntent): unknown {
    const obj: any = {};
    if (message.idpIntentId !== "") {
      obj.idpIntentId = message.idpIntentId;
    }
    if (message.idpIntentToken !== "") {
      obj.idpIntentToken = message.idpIntentToken;
    }
    return obj;
  },

  create(base?: DeepPartial<IDPIntent>): IDPIntent {
    return IDPIntent.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<IDPIntent>): IDPIntent {
    const message = createBaseIDPIntent();
    message.idpIntentId = object.idpIntentId ?? "";
    message.idpIntentToken = object.idpIntentToken ?? "";
    return message;
  },
};

function createBaseIDPInformation(): IDPInformation {
  return { oauth: undefined, ldap: undefined, idpId: "", userId: "", userName: "", rawInformation: undefined };
}

export const IDPInformation = {
  encode(message: IDPInformation, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.oauth !== undefined) {
      IDPOAuthAccessInformation.encode(message.oauth, writer.uint32(10).fork()).ldelim();
    }
    if (message.ldap !== undefined) {
      IDPLDAPAccessInformation.encode(message.ldap, writer.uint32(50).fork()).ldelim();
    }
    if (message.idpId !== "") {
      writer.uint32(18).string(message.idpId);
    }
    if (message.userId !== "") {
      writer.uint32(26).string(message.userId);
    }
    if (message.userName !== "") {
      writer.uint32(34).string(message.userName);
    }
    if (message.rawInformation !== undefined) {
      Struct.encode(Struct.wrap(message.rawInformation), writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IDPInformation {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIDPInformation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.oauth = IDPOAuthAccessInformation.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.ldap = IDPLDAPAccessInformation.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.idpId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.userId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.userName = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.rawInformation = Struct.unwrap(Struct.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IDPInformation {
    return {
      oauth: isSet(object.oauth) ? IDPOAuthAccessInformation.fromJSON(object.oauth) : undefined,
      ldap: isSet(object.ldap) ? IDPLDAPAccessInformation.fromJSON(object.ldap) : undefined,
      idpId: isSet(object.idpId) ? String(object.idpId) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
      userName: isSet(object.userName) ? String(object.userName) : "",
      rawInformation: isObject(object.rawInformation) ? object.rawInformation : undefined,
    };
  },

  toJSON(message: IDPInformation): unknown {
    const obj: any = {};
    if (message.oauth !== undefined) {
      obj.oauth = IDPOAuthAccessInformation.toJSON(message.oauth);
    }
    if (message.ldap !== undefined) {
      obj.ldap = IDPLDAPAccessInformation.toJSON(message.ldap);
    }
    if (message.idpId !== "") {
      obj.idpId = message.idpId;
    }
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    if (message.userName !== "") {
      obj.userName = message.userName;
    }
    if (message.rawInformation !== undefined) {
      obj.rawInformation = message.rawInformation;
    }
    return obj;
  },

  create(base?: DeepPartial<IDPInformation>): IDPInformation {
    return IDPInformation.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<IDPInformation>): IDPInformation {
    const message = createBaseIDPInformation();
    message.oauth = (object.oauth !== undefined && object.oauth !== null)
      ? IDPOAuthAccessInformation.fromPartial(object.oauth)
      : undefined;
    message.ldap = (object.ldap !== undefined && object.ldap !== null)
      ? IDPLDAPAccessInformation.fromPartial(object.ldap)
      : undefined;
    message.idpId = object.idpId ?? "";
    message.userId = object.userId ?? "";
    message.userName = object.userName ?? "";
    message.rawInformation = object.rawInformation ?? undefined;
    return message;
  },
};

function createBaseIDPOAuthAccessInformation(): IDPOAuthAccessInformation {
  return { accessToken: "", idToken: undefined };
}

export const IDPOAuthAccessInformation = {
  encode(message: IDPOAuthAccessInformation, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accessToken !== "") {
      writer.uint32(10).string(message.accessToken);
    }
    if (message.idToken !== undefined) {
      writer.uint32(18).string(message.idToken);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IDPOAuthAccessInformation {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIDPOAuthAccessInformation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.accessToken = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.idToken = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IDPOAuthAccessInformation {
    return {
      accessToken: isSet(object.accessToken) ? String(object.accessToken) : "",
      idToken: isSet(object.idToken) ? String(object.idToken) : undefined,
    };
  },

  toJSON(message: IDPOAuthAccessInformation): unknown {
    const obj: any = {};
    if (message.accessToken !== "") {
      obj.accessToken = message.accessToken;
    }
    if (message.idToken !== undefined) {
      obj.idToken = message.idToken;
    }
    return obj;
  },

  create(base?: DeepPartial<IDPOAuthAccessInformation>): IDPOAuthAccessInformation {
    return IDPOAuthAccessInformation.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<IDPOAuthAccessInformation>): IDPOAuthAccessInformation {
    const message = createBaseIDPOAuthAccessInformation();
    message.accessToken = object.accessToken ?? "";
    message.idToken = object.idToken ?? undefined;
    return message;
  },
};

function createBaseIDPLDAPAccessInformation(): IDPLDAPAccessInformation {
  return { attributes: undefined };
}

export const IDPLDAPAccessInformation = {
  encode(message: IDPLDAPAccessInformation, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.attributes !== undefined) {
      Struct.encode(Struct.wrap(message.attributes), writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IDPLDAPAccessInformation {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIDPLDAPAccessInformation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.attributes = Struct.unwrap(Struct.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IDPLDAPAccessInformation {
    return { attributes: isObject(object.attributes) ? object.attributes : undefined };
  },

  toJSON(message: IDPLDAPAccessInformation): unknown {
    const obj: any = {};
    if (message.attributes !== undefined) {
      obj.attributes = message.attributes;
    }
    return obj;
  },

  create(base?: DeepPartial<IDPLDAPAccessInformation>): IDPLDAPAccessInformation {
    return IDPLDAPAccessInformation.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<IDPLDAPAccessInformation>): IDPLDAPAccessInformation {
    const message = createBaseIDPLDAPAccessInformation();
    message.attributes = object.attributes ?? undefined;
    return message;
  },
};

function createBaseIDPLink(): IDPLink {
  return { idpId: "", userId: "", userName: "" };
}

export const IDPLink = {
  encode(message: IDPLink, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.idpId !== "") {
      writer.uint32(10).string(message.idpId);
    }
    if (message.userId !== "") {
      writer.uint32(18).string(message.userId);
    }
    if (message.userName !== "") {
      writer.uint32(26).string(message.userName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IDPLink {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIDPLink();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.idpId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.userId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.userName = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IDPLink {
    return {
      idpId: isSet(object.idpId) ? String(object.idpId) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
      userName: isSet(object.userName) ? String(object.userName) : "",
    };
  },

  toJSON(message: IDPLink): unknown {
    const obj: any = {};
    if (message.idpId !== "") {
      obj.idpId = message.idpId;
    }
    if (message.userId !== "") {
      obj.userId = message.userId;
    }
    if (message.userName !== "") {
      obj.userName = message.userName;
    }
    return obj;
  },

  create(base?: DeepPartial<IDPLink>): IDPLink {
    return IDPLink.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<IDPLink>): IDPLink {
    const message = createBaseIDPLink();
    message.idpId = object.idpId ?? "";
    message.userId = object.userId ?? "";
    message.userName = object.userName ?? "";
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
