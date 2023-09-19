/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "zitadel.user.v2beta";

export enum Gender {
  GENDER_UNSPECIFIED = 0,
  GENDER_FEMALE = 1,
  GENDER_MALE = 2,
  GENDER_DIVERSE = 3,
  UNRECOGNIZED = -1,
}

export function genderFromJSON(object: any): Gender {
  switch (object) {
    case 0:
    case "GENDER_UNSPECIFIED":
      return Gender.GENDER_UNSPECIFIED;
    case 1:
    case "GENDER_FEMALE":
      return Gender.GENDER_FEMALE;
    case 2:
    case "GENDER_MALE":
      return Gender.GENDER_MALE;
    case 3:
    case "GENDER_DIVERSE":
      return Gender.GENDER_DIVERSE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Gender.UNRECOGNIZED;
  }
}

export function genderToJSON(object: Gender): string {
  switch (object) {
    case Gender.GENDER_UNSPECIFIED:
      return "GENDER_UNSPECIFIED";
    case Gender.GENDER_FEMALE:
      return "GENDER_FEMALE";
    case Gender.GENDER_MALE:
      return "GENDER_MALE";
    case Gender.GENDER_DIVERSE:
      return "GENDER_DIVERSE";
    case Gender.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface User {
  id: string;
}

export interface SetHumanProfile {
  givenName: string;
  familyName: string;
  nickName?: string | undefined;
  displayName?: string | undefined;
  preferredLanguage?: string | undefined;
  gender?: Gender | undefined;
}

export interface SetMetadataEntry {
  key: string;
  value: Buffer;
}

function createBaseUser(): User {
  return { id: "" };
}

export const User = {
  encode(message: User, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): User {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUser();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): User {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: User): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    return obj;
  },

  create(base?: DeepPartial<User>): User {
    return User.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<User>): User {
    const message = createBaseUser();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseSetHumanProfile(): SetHumanProfile {
  return {
    givenName: "",
    familyName: "",
    nickName: undefined,
    displayName: undefined,
    preferredLanguage: undefined,
    gender: undefined,
  };
}

export const SetHumanProfile = {
  encode(message: SetHumanProfile, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.givenName !== "") {
      writer.uint32(10).string(message.givenName);
    }
    if (message.familyName !== "") {
      writer.uint32(18).string(message.familyName);
    }
    if (message.nickName !== undefined) {
      writer.uint32(26).string(message.nickName);
    }
    if (message.displayName !== undefined) {
      writer.uint32(34).string(message.displayName);
    }
    if (message.preferredLanguage !== undefined) {
      writer.uint32(42).string(message.preferredLanguage);
    }
    if (message.gender !== undefined) {
      writer.uint32(48).int32(message.gender);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetHumanProfile {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetHumanProfile();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.givenName = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.familyName = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.nickName = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.displayName = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.preferredLanguage = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.gender = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SetHumanProfile {
    return {
      givenName: isSet(object.givenName) ? String(object.givenName) : "",
      familyName: isSet(object.familyName) ? String(object.familyName) : "",
      nickName: isSet(object.nickName) ? String(object.nickName) : undefined,
      displayName: isSet(object.displayName) ? String(object.displayName) : undefined,
      preferredLanguage: isSet(object.preferredLanguage) ? String(object.preferredLanguage) : undefined,
      gender: isSet(object.gender) ? genderFromJSON(object.gender) : undefined,
    };
  },

  toJSON(message: SetHumanProfile): unknown {
    const obj: any = {};
    if (message.givenName !== "") {
      obj.givenName = message.givenName;
    }
    if (message.familyName !== "") {
      obj.familyName = message.familyName;
    }
    if (message.nickName !== undefined) {
      obj.nickName = message.nickName;
    }
    if (message.displayName !== undefined) {
      obj.displayName = message.displayName;
    }
    if (message.preferredLanguage !== undefined) {
      obj.preferredLanguage = message.preferredLanguage;
    }
    if (message.gender !== undefined) {
      obj.gender = genderToJSON(message.gender);
    }
    return obj;
  },

  create(base?: DeepPartial<SetHumanProfile>): SetHumanProfile {
    return SetHumanProfile.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<SetHumanProfile>): SetHumanProfile {
    const message = createBaseSetHumanProfile();
    message.givenName = object.givenName ?? "";
    message.familyName = object.familyName ?? "";
    message.nickName = object.nickName ?? undefined;
    message.displayName = object.displayName ?? undefined;
    message.preferredLanguage = object.preferredLanguage ?? undefined;
    message.gender = object.gender ?? undefined;
    return message;
  },
};

function createBaseSetMetadataEntry(): SetMetadataEntry {
  return { key: "", value: Buffer.alloc(0) };
}

export const SetMetadataEntry = {
  encode(message: SetMetadataEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value.length !== 0) {
      writer.uint32(18).bytes(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetMetadataEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetMetadataEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = reader.bytes() as Buffer;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SetMetadataEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? Buffer.from(bytesFromBase64(object.value)) : Buffer.alloc(0),
    };
  },

  toJSON(message: SetMetadataEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value.length !== 0) {
      obj.value = base64FromBytes(message.value);
    }
    return obj;
  },

  create(base?: DeepPartial<SetMetadataEntry>): SetMetadataEntry {
    return SetMetadataEntry.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<SetMetadataEntry>): SetMetadataEntry {
    const message = createBaseSetMetadataEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? Buffer.alloc(0);
    return message;
  },
};

declare const self: any | undefined;
declare const window: any | undefined;
declare const global: any | undefined;
const tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function bytesFromBase64(b64: string): Uint8Array {
  if (tsProtoGlobalThis.Buffer) {
    return Uint8Array.from(tsProtoGlobalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = tsProtoGlobalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (tsProtoGlobalThis.Buffer) {
    return tsProtoGlobalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return tsProtoGlobalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
