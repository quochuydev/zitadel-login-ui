/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Timestamp } from "../../../google/protobuf/timestamp";

export const protobufPackage = "zitadel.session.v2beta";

export interface Session {
  id: string;
  creationDate: Date | undefined;
  changeDate: Date | undefined;
  sequence: number;
  factors: Factors | undefined;
  metadata: { [key: string]: Buffer };
}

export interface Session_MetadataEntry {
  key: string;
  value: Buffer;
}

export interface Factors {
  user: UserFactor | undefined;
  password: PasswordFactor | undefined;
  webAuthN: WebAuthNFactor | undefined;
  intent: IntentFactor | undefined;
  totp: TOTPFactor | undefined;
  otpSms: OTPFactor | undefined;
  otpEmail: OTPFactor | undefined;
}

export interface UserFactor {
  verifiedAt: Date | undefined;
  id: string;
  loginName: string;
  displayName: string;
  organisationId: string;
}

export interface PasswordFactor {
  verifiedAt: Date | undefined;
}

export interface IntentFactor {
  verifiedAt: Date | undefined;
}

export interface WebAuthNFactor {
  verifiedAt: Date | undefined;
  userVerified: boolean;
}

export interface TOTPFactor {
  verifiedAt: Date | undefined;
}

export interface OTPFactor {
  verifiedAt: Date | undefined;
}

export interface SearchQuery {
  idsQuery?: IDsQuery | undefined;
}

export interface IDsQuery {
  ids: string[];
}

function createBaseSession(): Session {
  return { id: "", creationDate: undefined, changeDate: undefined, sequence: 0, factors: undefined, metadata: {} };
}

export const Session = {
  encode(message: Session, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.creationDate !== undefined) {
      Timestamp.encode(toTimestamp(message.creationDate), writer.uint32(18).fork()).ldelim();
    }
    if (message.changeDate !== undefined) {
      Timestamp.encode(toTimestamp(message.changeDate), writer.uint32(26).fork()).ldelim();
    }
    if (message.sequence !== 0) {
      writer.uint32(32).uint64(message.sequence);
    }
    if (message.factors !== undefined) {
      Factors.encode(message.factors, writer.uint32(42).fork()).ldelim();
    }
    Object.entries(message.metadata).forEach(([key, value]) => {
      Session_MetadataEntry.encode({ key: key as any, value }, writer.uint32(50).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Session {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSession();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.creationDate = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.changeDate = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.sequence = longToNumber(reader.uint64() as Long);
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.factors = Factors.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          const entry6 = Session_MetadataEntry.decode(reader, reader.uint32());
          if (entry6.value !== undefined) {
            message.metadata[entry6.key] = entry6.value;
          }
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Session {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      creationDate: isSet(object.creationDate) ? fromJsonTimestamp(object.creationDate) : undefined,
      changeDate: isSet(object.changeDate) ? fromJsonTimestamp(object.changeDate) : undefined,
      sequence: isSet(object.sequence) ? Number(object.sequence) : 0,
      factors: isSet(object.factors) ? Factors.fromJSON(object.factors) : undefined,
      metadata: isObject(object.metadata)
        ? Object.entries(object.metadata).reduce<{ [key: string]: Buffer }>((acc, [key, value]) => {
          acc[key] = Buffer.from(bytesFromBase64(value as string));
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: Session): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.creationDate !== undefined) {
      obj.creationDate = message.creationDate.toISOString();
    }
    if (message.changeDate !== undefined) {
      obj.changeDate = message.changeDate.toISOString();
    }
    if (message.sequence !== 0) {
      obj.sequence = Math.round(message.sequence);
    }
    if (message.factors !== undefined) {
      obj.factors = Factors.toJSON(message.factors);
    }
    if (message.metadata) {
      const entries = Object.entries(message.metadata);
      if (entries.length > 0) {
        obj.metadata = {};
        entries.forEach(([k, v]) => {
          obj.metadata[k] = base64FromBytes(v);
        });
      }
    }
    return obj;
  },

  create(base?: DeepPartial<Session>): Session {
    return Session.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Session>): Session {
    const message = createBaseSession();
    message.id = object.id ?? "";
    message.creationDate = object.creationDate ?? undefined;
    message.changeDate = object.changeDate ?? undefined;
    message.sequence = object.sequence ?? 0;
    message.factors = (object.factors !== undefined && object.factors !== null)
      ? Factors.fromPartial(object.factors)
      : undefined;
    message.metadata = Object.entries(object.metadata ?? {}).reduce<{ [key: string]: Buffer }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseSession_MetadataEntry(): Session_MetadataEntry {
  return { key: "", value: Buffer.alloc(0) };
}

export const Session_MetadataEntry = {
  encode(message: Session_MetadataEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value.length !== 0) {
      writer.uint32(18).bytes(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Session_MetadataEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSession_MetadataEntry();
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

  fromJSON(object: any): Session_MetadataEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? Buffer.from(bytesFromBase64(object.value)) : Buffer.alloc(0),
    };
  },

  toJSON(message: Session_MetadataEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value.length !== 0) {
      obj.value = base64FromBytes(message.value);
    }
    return obj;
  },

  create(base?: DeepPartial<Session_MetadataEntry>): Session_MetadataEntry {
    return Session_MetadataEntry.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Session_MetadataEntry>): Session_MetadataEntry {
    const message = createBaseSession_MetadataEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? Buffer.alloc(0);
    return message;
  },
};

function createBaseFactors(): Factors {
  return {
    user: undefined,
    password: undefined,
    webAuthN: undefined,
    intent: undefined,
    totp: undefined,
    otpSms: undefined,
    otpEmail: undefined,
  };
}

export const Factors = {
  encode(message: Factors, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.user !== undefined) {
      UserFactor.encode(message.user, writer.uint32(10).fork()).ldelim();
    }
    if (message.password !== undefined) {
      PasswordFactor.encode(message.password, writer.uint32(18).fork()).ldelim();
    }
    if (message.webAuthN !== undefined) {
      WebAuthNFactor.encode(message.webAuthN, writer.uint32(26).fork()).ldelim();
    }
    if (message.intent !== undefined) {
      IntentFactor.encode(message.intent, writer.uint32(34).fork()).ldelim();
    }
    if (message.totp !== undefined) {
      TOTPFactor.encode(message.totp, writer.uint32(42).fork()).ldelim();
    }
    if (message.otpSms !== undefined) {
      OTPFactor.encode(message.otpSms, writer.uint32(50).fork()).ldelim();
    }
    if (message.otpEmail !== undefined) {
      OTPFactor.encode(message.otpEmail, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Factors {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFactors();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.user = UserFactor.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.password = PasswordFactor.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.webAuthN = WebAuthNFactor.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.intent = IntentFactor.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.totp = TOTPFactor.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.otpSms = OTPFactor.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.otpEmail = OTPFactor.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Factors {
    return {
      user: isSet(object.user) ? UserFactor.fromJSON(object.user) : undefined,
      password: isSet(object.password) ? PasswordFactor.fromJSON(object.password) : undefined,
      webAuthN: isSet(object.webAuthN) ? WebAuthNFactor.fromJSON(object.webAuthN) : undefined,
      intent: isSet(object.intent) ? IntentFactor.fromJSON(object.intent) : undefined,
      totp: isSet(object.totp) ? TOTPFactor.fromJSON(object.totp) : undefined,
      otpSms: isSet(object.otpSms) ? OTPFactor.fromJSON(object.otpSms) : undefined,
      otpEmail: isSet(object.otpEmail) ? OTPFactor.fromJSON(object.otpEmail) : undefined,
    };
  },

  toJSON(message: Factors): unknown {
    const obj: any = {};
    if (message.user !== undefined) {
      obj.user = UserFactor.toJSON(message.user);
    }
    if (message.password !== undefined) {
      obj.password = PasswordFactor.toJSON(message.password);
    }
    if (message.webAuthN !== undefined) {
      obj.webAuthN = WebAuthNFactor.toJSON(message.webAuthN);
    }
    if (message.intent !== undefined) {
      obj.intent = IntentFactor.toJSON(message.intent);
    }
    if (message.totp !== undefined) {
      obj.totp = TOTPFactor.toJSON(message.totp);
    }
    if (message.otpSms !== undefined) {
      obj.otpSms = OTPFactor.toJSON(message.otpSms);
    }
    if (message.otpEmail !== undefined) {
      obj.otpEmail = OTPFactor.toJSON(message.otpEmail);
    }
    return obj;
  },

  create(base?: DeepPartial<Factors>): Factors {
    return Factors.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Factors>): Factors {
    const message = createBaseFactors();
    message.user = (object.user !== undefined && object.user !== null)
      ? UserFactor.fromPartial(object.user)
      : undefined;
    message.password = (object.password !== undefined && object.password !== null)
      ? PasswordFactor.fromPartial(object.password)
      : undefined;
    message.webAuthN = (object.webAuthN !== undefined && object.webAuthN !== null)
      ? WebAuthNFactor.fromPartial(object.webAuthN)
      : undefined;
    message.intent = (object.intent !== undefined && object.intent !== null)
      ? IntentFactor.fromPartial(object.intent)
      : undefined;
    message.totp = (object.totp !== undefined && object.totp !== null)
      ? TOTPFactor.fromPartial(object.totp)
      : undefined;
    message.otpSms = (object.otpSms !== undefined && object.otpSms !== null)
      ? OTPFactor.fromPartial(object.otpSms)
      : undefined;
    message.otpEmail = (object.otpEmail !== undefined && object.otpEmail !== null)
      ? OTPFactor.fromPartial(object.otpEmail)
      : undefined;
    return message;
  },
};

function createBaseUserFactor(): UserFactor {
  return { verifiedAt: undefined, id: "", loginName: "", displayName: "", organisationId: "" };
}

export const UserFactor = {
  encode(message: UserFactor, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.verifiedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.verifiedAt), writer.uint32(10).fork()).ldelim();
    }
    if (message.id !== "") {
      writer.uint32(18).string(message.id);
    }
    if (message.loginName !== "") {
      writer.uint32(26).string(message.loginName);
    }
    if (message.displayName !== "") {
      writer.uint32(34).string(message.displayName);
    }
    if (message.organisationId !== "") {
      writer.uint32(42).string(message.organisationId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserFactor {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserFactor();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.verifiedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.id = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.loginName = reader.string();
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

          message.organisationId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UserFactor {
    return {
      verifiedAt: isSet(object.verifiedAt) ? fromJsonTimestamp(object.verifiedAt) : undefined,
      id: isSet(object.id) ? String(object.id) : "",
      loginName: isSet(object.loginName) ? String(object.loginName) : "",
      displayName: isSet(object.displayName) ? String(object.displayName) : "",
      organisationId: isSet(object.organisationId) ? String(object.organisationId) : "",
    };
  },

  toJSON(message: UserFactor): unknown {
    const obj: any = {};
    if (message.verifiedAt !== undefined) {
      obj.verifiedAt = message.verifiedAt.toISOString();
    }
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.loginName !== "") {
      obj.loginName = message.loginName;
    }
    if (message.displayName !== "") {
      obj.displayName = message.displayName;
    }
    if (message.organisationId !== "") {
      obj.organisationId = message.organisationId;
    }
    return obj;
  },

  create(base?: DeepPartial<UserFactor>): UserFactor {
    return UserFactor.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<UserFactor>): UserFactor {
    const message = createBaseUserFactor();
    message.verifiedAt = object.verifiedAt ?? undefined;
    message.id = object.id ?? "";
    message.loginName = object.loginName ?? "";
    message.displayName = object.displayName ?? "";
    message.organisationId = object.organisationId ?? "";
    return message;
  },
};

function createBasePasswordFactor(): PasswordFactor {
  return { verifiedAt: undefined };
}

export const PasswordFactor = {
  encode(message: PasswordFactor, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.verifiedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.verifiedAt), writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PasswordFactor {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePasswordFactor();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.verifiedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PasswordFactor {
    return { verifiedAt: isSet(object.verifiedAt) ? fromJsonTimestamp(object.verifiedAt) : undefined };
  },

  toJSON(message: PasswordFactor): unknown {
    const obj: any = {};
    if (message.verifiedAt !== undefined) {
      obj.verifiedAt = message.verifiedAt.toISOString();
    }
    return obj;
  },

  create(base?: DeepPartial<PasswordFactor>): PasswordFactor {
    return PasswordFactor.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<PasswordFactor>): PasswordFactor {
    const message = createBasePasswordFactor();
    message.verifiedAt = object.verifiedAt ?? undefined;
    return message;
  },
};

function createBaseIntentFactor(): IntentFactor {
  return { verifiedAt: undefined };
}

export const IntentFactor = {
  encode(message: IntentFactor, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.verifiedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.verifiedAt), writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IntentFactor {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIntentFactor();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.verifiedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IntentFactor {
    return { verifiedAt: isSet(object.verifiedAt) ? fromJsonTimestamp(object.verifiedAt) : undefined };
  },

  toJSON(message: IntentFactor): unknown {
    const obj: any = {};
    if (message.verifiedAt !== undefined) {
      obj.verifiedAt = message.verifiedAt.toISOString();
    }
    return obj;
  },

  create(base?: DeepPartial<IntentFactor>): IntentFactor {
    return IntentFactor.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<IntentFactor>): IntentFactor {
    const message = createBaseIntentFactor();
    message.verifiedAt = object.verifiedAt ?? undefined;
    return message;
  },
};

function createBaseWebAuthNFactor(): WebAuthNFactor {
  return { verifiedAt: undefined, userVerified: false };
}

export const WebAuthNFactor = {
  encode(message: WebAuthNFactor, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.verifiedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.verifiedAt), writer.uint32(10).fork()).ldelim();
    }
    if (message.userVerified === true) {
      writer.uint32(16).bool(message.userVerified);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WebAuthNFactor {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWebAuthNFactor();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.verifiedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.userVerified = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): WebAuthNFactor {
    return {
      verifiedAt: isSet(object.verifiedAt) ? fromJsonTimestamp(object.verifiedAt) : undefined,
      userVerified: isSet(object.userVerified) ? Boolean(object.userVerified) : false,
    };
  },

  toJSON(message: WebAuthNFactor): unknown {
    const obj: any = {};
    if (message.verifiedAt !== undefined) {
      obj.verifiedAt = message.verifiedAt.toISOString();
    }
    if (message.userVerified === true) {
      obj.userVerified = message.userVerified;
    }
    return obj;
  },

  create(base?: DeepPartial<WebAuthNFactor>): WebAuthNFactor {
    return WebAuthNFactor.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<WebAuthNFactor>): WebAuthNFactor {
    const message = createBaseWebAuthNFactor();
    message.verifiedAt = object.verifiedAt ?? undefined;
    message.userVerified = object.userVerified ?? false;
    return message;
  },
};

function createBaseTOTPFactor(): TOTPFactor {
  return { verifiedAt: undefined };
}

export const TOTPFactor = {
  encode(message: TOTPFactor, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.verifiedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.verifiedAt), writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TOTPFactor {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTOTPFactor();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.verifiedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TOTPFactor {
    return { verifiedAt: isSet(object.verifiedAt) ? fromJsonTimestamp(object.verifiedAt) : undefined };
  },

  toJSON(message: TOTPFactor): unknown {
    const obj: any = {};
    if (message.verifiedAt !== undefined) {
      obj.verifiedAt = message.verifiedAt.toISOString();
    }
    return obj;
  },

  create(base?: DeepPartial<TOTPFactor>): TOTPFactor {
    return TOTPFactor.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<TOTPFactor>): TOTPFactor {
    const message = createBaseTOTPFactor();
    message.verifiedAt = object.verifiedAt ?? undefined;
    return message;
  },
};

function createBaseOTPFactor(): OTPFactor {
  return { verifiedAt: undefined };
}

export const OTPFactor = {
  encode(message: OTPFactor, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.verifiedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.verifiedAt), writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OTPFactor {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOTPFactor();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.verifiedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): OTPFactor {
    return { verifiedAt: isSet(object.verifiedAt) ? fromJsonTimestamp(object.verifiedAt) : undefined };
  },

  toJSON(message: OTPFactor): unknown {
    const obj: any = {};
    if (message.verifiedAt !== undefined) {
      obj.verifiedAt = message.verifiedAt.toISOString();
    }
    return obj;
  },

  create(base?: DeepPartial<OTPFactor>): OTPFactor {
    return OTPFactor.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<OTPFactor>): OTPFactor {
    const message = createBaseOTPFactor();
    message.verifiedAt = object.verifiedAt ?? undefined;
    return message;
  },
};

function createBaseSearchQuery(): SearchQuery {
  return { idsQuery: undefined };
}

export const SearchQuery = {
  encode(message: SearchQuery, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.idsQuery !== undefined) {
      IDsQuery.encode(message.idsQuery, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SearchQuery {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSearchQuery();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.idsQuery = IDsQuery.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SearchQuery {
    return { idsQuery: isSet(object.idsQuery) ? IDsQuery.fromJSON(object.idsQuery) : undefined };
  },

  toJSON(message: SearchQuery): unknown {
    const obj: any = {};
    if (message.idsQuery !== undefined) {
      obj.idsQuery = IDsQuery.toJSON(message.idsQuery);
    }
    return obj;
  },

  create(base?: DeepPartial<SearchQuery>): SearchQuery {
    return SearchQuery.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<SearchQuery>): SearchQuery {
    const message = createBaseSearchQuery();
    message.idsQuery = (object.idsQuery !== undefined && object.idsQuery !== null)
      ? IDsQuery.fromPartial(object.idsQuery)
      : undefined;
    return message;
  },
};

function createBaseIDsQuery(): IDsQuery {
  return { ids: [] };
}

export const IDsQuery = {
  encode(message: IDsQuery, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.ids) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IDsQuery {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIDsQuery();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.ids.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IDsQuery {
    return { ids: Array.isArray(object?.ids) ? object.ids.map((e: any) => String(e)) : [] };
  },

  toJSON(message: IDsQuery): unknown {
    const obj: any = {};
    if (message.ids?.length) {
      obj.ids = message.ids;
    }
    return obj;
  },

  create(base?: DeepPartial<IDsQuery>): IDsQuery {
    return IDsQuery.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<IDsQuery>): IDsQuery {
    const message = createBaseIDsQuery();
    message.ids = object.ids?.map((e) => e) || [];
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

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = (t.seconds || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
