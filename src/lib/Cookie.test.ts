import { Cookie } from "./Cookie";
import { CookieError } from "./CookieError";
import { SameSite } from "./SameSite";

describe("Cookie", () => {
  let cookie: Cookie;

  beforeEach(() => {
    cookie = new Cookie("id", "testing123");
  });

  test("it sets the name", () => {
    cookie.setName("bar");
    expect(cookie.name).toBe("bar");
  });

  test("it sets the value", () => {
    cookie.setValue("newvalue");
    expect(cookie.value).toBe("newvalue");
  });

  test("it sets the Expires attribute with a Date", () => {
    const expiresDate = new Date(2022, 0, 31, 0, 0, 0);
    const expectedDate = "Mon, 31 Jan 2022 05:00:00 GMT";
    cookie.setExpires(expiresDate);
    expect(cookie.expires).toBe(expectedDate);
  });

  test("it sets the Expires attribute with a UTC string", () => {
    const expiresDate = "Mon, 31 Jan 2022 05:00:00 GMT";
    cookie.setExpires(expiresDate);
    expect(cookie.expires).toBe(expiresDate);
  });

  test("it sets the Max-Age attribute", () => {
    cookie.setMaxAge(604880);
    expect(cookie.maxAge).toBe(604880);
  });

  test("it sets the Domain attribute", () => {
    cookie.setDomain("example.com");
    expect(cookie.domain).toBe("example.com");
  });

  test("it sets the Path attribute", () => {
    cookie.setPath("/test");
    expect(cookie.path).toBe("/test");
  });

  test("it enables Secure by default", () => {
    expect(cookie.secure).toBe(true);
  });

  test("it sets the Secure attribute", () => {
    cookie.setSecure(false);
    expect(cookie.secure).toBe(false);
  });

  test("it throws if Secure is disabled when SameSite=None", () => {
    const errorCondition = () => {
      cookie.setSameSite(SameSite.None);
      cookie.setSecure(false);
    };

    expect(errorCondition).toThrowError(CookieError);
  });

  test("it enables HttpOnly by default", () => {
    expect(cookie.httpOnly).toBe(true);
  });

  test("it sets the HttpOnly attribute", () => {
    cookie.setHttpOnly(false);
    expect(cookie.httpOnly).toBe(false);
  });

  test("it sets SameSite=Lax by default", () => {
    expect(cookie.sameSite).toBe(SameSite.Lax);
  });

  test("it sets the SameSite attribute", () => {
    cookie.setSameSite(SameSite.Strict);
    expect(cookie.sameSite).toBe(SameSite.Strict);
  });

  test("it enables Secure if setting SameSite to None", () => {
    cookie.setSameSite(SameSite.None);
    expect(cookie.sameSite).toBe(SameSite.None);
    expect(cookie.secure).toBe(true);
  });

  test("it outputs a cookie string excluding false HttpOnly & Secure", () => {
    const expiresDate = "Mon, 31 Jan 2022 05:00:00 GMT";
    const expectedCookie = `id=testing123; SameSite=Strict; Domain=example.com; Path=/test; Max-Age=604880; Expires=${expiresDate}`;
    cookie
      .setDomain("example.com")
      .setExpires(expiresDate)
      .setHttpOnly(false)
      .setMaxAge(604880)
      .setPath("/test")
      .setSameSite(SameSite.Strict)
      .setSecure(false);

    expect(cookie.toString()).toMatch(expectedCookie);
  });

  test("it outputs a cookie string including true HttpOnly & Secure", () => {
    const expiresDate = "Mon, 31 Jan 2022 05:00:00 GMT";
    const expectedCookie = `id=testing123; SameSite=Strict; Domain=example.com; Path=/test; HttpOnly; Secure; Max-Age=604880; Expires=${expiresDate}`;
    cookie
      .setDomain("example.com")
      .setExpires(expiresDate)
      .setMaxAge(604880)
      .setPath("/test")
      .setSameSite(SameSite.Strict);

    expect(cookie.toString()).toMatch(expectedCookie);
  });

  test("it parses a string including HttpOnly & Secure to a Cookie", () => {
    const expiresDate = "Mon, 31 Jan 2022 05:00:00 GMT";
    const cookieStr = `id=testing123; SameSite=Strict; Domain=example.com; Path=/test; HttpOnly; Secure; Max-Age=604880; Expires=${expiresDate}`;
    const expectedCookie = new Cookie("id", "testing123")
      .setDomain("example.com")
      .setExpires(expiresDate)
      .setMaxAge(604880)
      .setPath("/test")
      .setSameSite(SameSite.Strict);

    expect(Cookie.parse(cookieStr)).toEqual(expectedCookie);
  });

  test("it parses a string excluding HttpOnly & Secure to a Cookie", () => {
    const expiresDate = "Mon, 31 Jan 2022 05:00:00 GMT";
    const cookieStr = `id=testing123; SameSite=Strict; Domain=example.com; Path=/test; Max-Age=604880; Expires=${expiresDate}`;
    const expectedCookie = new Cookie("id", "testing123")
      .setDomain("example.com")
      .setExpires(expiresDate)
      .setMaxAge(604880)
      .setPath("/test")
      .setSameSite(SameSite.Strict)
      .setHttpOnly(false)
      .setSecure(false);

    expect(Cookie.parse(cookieStr)).toEqual(expectedCookie);
  });
});
