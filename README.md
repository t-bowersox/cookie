# cookie

Create and parse cookies.

## Installation

```bash
npm i @t-bowersox/cookie
```

## Usage

### Create a cookie

When calling the `Cookie` constructor, you can chain additional methods to set its attributes.

To output the cookie as a string you can use with `Set-Cookie` header, call its `toString()` method.

```typescript
import { Cookie } from "@t-bowersox/cookie";

// HttpOnly and Secure are enabled by default
const cookie = new Cookie("id", "cookie-value")
  .setExpires(new Date("2022-02-07 23:59:59"))
  .setMaxAge(604800)
  .setDomain("example.com")
  .setPath("/")
  .setSameSite(SameSite.Strict); // Default is Lax

console.log(cookie.toString());
// "id=cookie-value; SameSite=Strict; Domain=example.com; Path=/; HttpOnly; Secure; Max-Age=604800; Expires=Tue, 08 Feb 2022 04:59:59 GMT"

// Use the string value with a ServerResponse object using setHeader()
response.setHeader("Set-Cookie", cookie.toString());
```

### Parse a cookie

You can parse a cookie string into a `Cookie` object by calling the `Cookie.parse()` static method.

```typescript
import { Cookie } from "@t-bowersox/cookie";

const cookieStr =
  "id=cookie-value; SameSite=Strict; Domain=example.com; Path=/; HttpOnly; Secure; Max-Age=604800; Expires=Tue, 08 Feb 2022 04:59:59 GMT";

const cookie = Cookie.parse(cookieStr);

console.log(cookie.name); // "id"
console.log(cookie.value); // "cookie-value"
console.log(cookie.sameSite); // "Strict"
console.log(cookie.domain); // "example.com"
console.log(cookie.path); // "/"
console.log(cookie.HttpOnly); // true
console.log(cookie.secure); // true
console.log(cookie.maxAge); // 604800
console.log(cookie.expires); // "Tue, 08 Feb 2022 04:59:59 GMT"
```

## API

### Class `Cookie`

This is the class used to create and parse cookies.

```typescript
export declare class Cookie {
  get name(): string;
  get value(): string;
  get expires(): string | undefined;
  get maxAge(): number | undefined;
  get domain(): string | undefined;
  get path(): string | undefined;
  get secure(): boolean;
  get httpOnly(): boolean;
  get sameSite(): SameSite;
  constructor(name: string, value: string);
}
```

#### Method `setName`

Sets the cookie's name.

- Parameter: `name` - The name of the cookie.
- Returns: The `Cookie` instance.

```typescript
setName(name: string): Cookie;
```

### Method `setValue`

Sets the cookie's value.

- Parameter: `value` - The value of the cookie.
- Returns: The `Cookie` instance.

```typescript
setValue(value: string): Cookie;
```

### Method `setExpires`

Sets the cookie's `Expires` attribute. If provided a `Date` object, it will be converted to a UTC string.

- Parameter: `date` - A `Date` object or a UTC date string.
- Returns: The `Cookie` instance.

```typescript
setExpires(date: Date | string): Cookie;
```

#### Method `setMaxAge`

Sets the cookie's `Max-Age` attribute.

- Parameter: `maxAge` - The maximum age, in seconds.
- Returns: The `Cookie` instance.

```typescript
setMaxAge(maxAge: number): Cookie;
```

#### Method `setDomain`

Sets the cookie's `Domain` attribute.

- Parameter: `domain` - The domain to which the cookie will be sent.
- Returns: The `Cookie` instance.

```typescript
setDomain(domain: string): Cookie;
```

#### Method `setPath`

Sets the cookie's `Path` attribute.

- Parameter: `path` - The `path` that must exist in a URL for the browser to send the cookie.
- Returns: The `Cookie` instance.

```typescript
setPath(path: string): Cookie;
```

#### Method `setSecure`

Sets the cookie's `Secure` attribute.

- Parameter: `secure` - Set to `true` to include the `Secure` attribute; `false` to exclude it. Each new `Cookie` instance defaults to `true`.
- Returns: The `Cookie` instance.

```typescript
setSecure(secure: boolean): Cookie;
```

#### Method `setHttpOnly`

Sets the cookie's `HttpOnly` attribute.

- Parameter: `httpOnly` - Set to `true` to include the `HttpOnly` attribute; `false` to exclude it. Each new `Cookie` instance defaults to `true`.
- Returns: The `Cookie` instance.

```typescript
setHttpOnly(httpOnly: boolean): Cookie;
```

#### Method `setSameSite`

Sets the cookie's `SameSite` attribute.

- Parameter: `sameSite` - One of `SameSite.Strict`, `SameSite.Lax`, or `SameSite.None`. If set to "None", `Secure` will be set to `true` because such cookies require a secure context.
- Returns: The `Cookie` instance.

```typescript
setSameSite(sameSite: SameSite): Cookie;
```

#### Method `toString`

Returns the `Cookie` instance as a string ready to use in a `Set-Cookie` header.

- Returns: The `Cookie` as a string.

```typescript
toString(): string;
```

#### Static method `Cookie.parse`

Parses a cookie string into a new `Cookie` instance.

When using this method, `Secure` and `HttpOnly` are _not_ enabled unless they are enabled in the cookie string.

In keeping with default browser behavior, if the string does not include a `SameSite` attribute, a default of "Lax" will be applied to the new `Cookie` instance.

- Parameter: `cookieStr` - A cookie string from a `Set-Cookie` header.
- Returns: A new `Cookie` instance.

```typescript
static parse(cookieStr: string): Cookie;
```

### Enum `SameSite`

These are the possible values used to set a cookie's `sameSite` property.

```typescript
export declare enum SameSite {
  Strict = "Strict",
  Lax = "Lax",
  None = "None",
}
```

### Class `CookieError`

This class of error is thrown if you attempt to call `setSecure(false)` on a cookie with `sameSite` set to `SameSite.None`. This is because browsers require cookies with a `SameSite=None` attribute to be in a secure context.

```typescript
export class CookieError extends Error {
  name = "CookieError";
}
```

## Contributing

This is primarily a package that I intend to reuse in my own projects. I've decided to open source it in case there are other folks who might also find it useful.

With that in mind, I only expect to make changes to Container that jibe with how I intend to use it myself.

But if you do have ideas or found bugs, please do file an issue and I'll gladly review it. 🙂
