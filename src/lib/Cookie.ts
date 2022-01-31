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

  /**
   * Sets the cookie's name.
   * @param name
   * @returns The `Cookie` instance.
   */
  setName(name: string): Cookie {
    this._name = name;
    return this;
  }

  /**
   * Sets the cookie's value.
   * @param value
   * @returns The `Cookie` instance.
   */
  setValue(value: string): Cookie {
    this._value = value;
    return this;
  }

  /**
   * Sets the cookie's `Expires` attribute.
   * If provided a `Date` object, it will be converted to a UTC string.
   * @param date A `Date` object or a UTC date string.
   * @returns The `Cookie` instance.
   */
  setExpires(date: Date | string): Cookie {
    this._expires = date instanceof Date ? date.toUTCString() : date;
    return this;
  }

  /**
   * Sets the cookie's `Max-Age` attribute.
   * @param maxAge The maximum age, in seconds.
   * @returns The `Cookie` instance.
   */
  setMaxAge(maxAge: number): Cookie {
    this._maxAge = maxAge;
    return this;
  }

  /**
   * Sets the cookie's `Domain` attribute.
   * @param domain
   * @returns The `Cookie` instance.
   */
  setDomain(domain: string): Cookie {
    this._domain = domain;
    return this;
  }

  /**
   * Sets the cookie's `Path` attribute.
   * @param path
   * @returns The `Cookie` instance.
   */
  setPath(path: string): Cookie {
    this._path = path;
    return this;
  }

  /**
   * Sets the cookie's `Secure` attribute.
   * @param secure `true` to include the `Secure` attribute; `false` to exclude it. Each new `Cookie` instance defaults to `true`.
   * @returns The `Cookie` instance.
   */
  setSecure(secure: boolean): Cookie {
    if (this._sameSite === SameSite.None && !secure) {
      throw new CookieError(
        'Secure context required: A cookie with "SameSite=None" must include "Secure".'
      );
    }
    this._secure = secure;
    return this;
  }

  /**
   * Sets the cookie's `HttpOnly` attribute.
   * @param httpOnly `true` to include the `HttpOnly` attribute; `false` to exclude it. Each new `Cookie` instance defaults to `true`.
   * @returns The `Cookie` instance.
   */
  setHttpOnly(httpOnly: boolean): Cookie {
    this._httpOnly = httpOnly;
    return this;
  }

  /**
   * Sets the cookie's `SameSite` attribute.
   * @param sameSite One of "Strict", "Lax", or "None".
   * If set to "None", `Secure` will be set to `true` because such cookies require a secure context.
   * @returns The `Cookie` instance.
   */
  setSameSite(sameSite: SameSite): Cookie {
    this._sameSite = sameSite;
    if (sameSite === SameSite.None) {
      // Cookies w/ SameSite=None require a secure context
      this._secure = true;
    }
    return this;
  }

  /**
   * Returns the `Cookie` instance as a string ready to use in a `Set-Cookie` header.
   * @returns The `Cookie` as a string.
   */
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

  /**
   * Parses a cookie string into a new `Cookie` instance.
   * When using this method, `Secure` and `HttpOnly` are _not_ enabled unless they
   * are enabled in the cookie string. In keeping with browser behavior, if the string
   * does not include a `SameSite` attribute, a default of "Lax" will be applied to the
   * new `Cookie` instance.
   * @param cookieStr A cookie string from a `Set-Cookie` header.
   * @returns A new `Cookie` instance.
   */
  static parse(cookieStr: string): Cookie {
    const cookieArr = cookieStr.split("; ").map((attr) => attr.split("="));
    const cookieObj: RawCookie = Object.fromEntries(cookieArr);
    const cookieAttrs = Object.keys(cookieObj);
    const cookie = new Cookie("", "").setHttpOnly(false).setSecure(false);
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
