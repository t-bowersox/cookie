import { CookieError } from "./CookieError";
import { SameSite } from "./SameSite";

export class Cookie {
  get name(): string {
    return this._name;
  }

  get value(): string {
    return this._value;
  }

  private _expires?: string;
  get expires(): string | undefined {
    return this._expires;
  }

  private _maxAge?: number;
  get maxAge(): number | undefined {
    return this._maxAge;
  }

  private _domain?: string;
  get domain(): string | undefined {
    return this._domain;
  }

  private _path?: string;
  get path(): string | undefined {
    return this._path;
  }

  private _secure = true;
  get secure(): boolean {
    return this._secure;
  }

  private _httpOnly = true;
  get httpOnly(): boolean {
    return this._httpOnly;
  }

  private _sameSite = SameSite.Lax;
  get sameSite(): SameSite {
    return this._sameSite;
  }

  constructor(private _name: string, private _value: string) {}

  setName(name: string): Cookie {
    this._name = name;
    return this;
  }

  setValue(value: string): Cookie {
    this._value = value;
    return this;
  }

  setExpires(date: Date | string): Cookie {
    this._expires = date instanceof Date ? date.toUTCString() : date;
    return this;
  }

  setMaxAge(maxAge: number): Cookie {
    this._maxAge = maxAge;
    return this;
  }

  setDomain(domain: string): Cookie {
    this._domain = domain;
    return this;
  }

  setPath(path: string): Cookie {
    this._path = path;
    return this;
  }

  setSecure(secure: boolean): Cookie {
    if (this._sameSite === SameSite.None && !secure) {
      throw new CookieError(
        'Secure context required: A cookie with "SameSite=None" must include "Secure".'
      );
    }
    this._secure = secure;
    return this;
  }

  setHttpOnly(httpOnly: boolean): Cookie {
    this._httpOnly = httpOnly;
    return this;
  }

  setSameSite(sameSite: SameSite): Cookie {
    this._sameSite = sameSite;
    if (sameSite === SameSite.None) {
      // Cookies w/ SameSite=None require a secure context
      this._secure = true;
    }
    return this;
  }

  toString(): string {
    let cookie = `${this.name}=${this.value}; SameSite=${this.sameSite}`;

    if (this.domain) cookie += `; Domain=${this.domain}`;
    if (this.path) cookie += `; Path=${this.path}`;
    if (this.httpOnly) cookie += `; HttpOnly`;
    if (this.secure) cookie += `; Secure`;
    if (this.maxAge) cookie += `; Max-Age=${this.maxAge}`;
    if (this.expires) cookie += `; Expires=${this.expires}`;

    return cookie;
  }

  static parse(cookieStr: string): Cookie {
    const cookieArr = cookieStr.split("; ").map((attr) => attr.split("="));
    const cookieObj: RawCookie = Object.fromEntries(cookieArr);
    const cookieAttrs = Object.keys(cookieObj);
    const cookie = new Cookie("", "");
    cookieAttrs.forEach((attr) => {
      switch (attr.toLowerCase()) {
        case "samesite":
          cookie.setSameSite(<SameSite>cookieObj[attr]);
          break;
        case "domain":
          cookie.setDomain(String(cookieObj[attr]));
          break;
        case "path":
          cookie.setPath(String(cookieObj[attr]));
          break;
        case "httponly":
          cookie.setHttpOnly(true);
          break;
        case "secure":
          cookie.setSecure(true);
          break;
        case "max-age":
          cookie.setMaxAge(Number(cookieObj[attr]));
          break;
        case "expires":
          cookie.setExpires(String(cookieObj[attr]));
          break;
        default:
          cookie.setName(attr);
          cookie.setValue(String(cookieObj[attr]));
      }
    });

    return cookie;
  }
}

interface RawCookie {
  [attr: string]: string | undefined;
}
