import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

function projectFile(path) {
  return new URL(path, projectRoot);
}

async function source(path) {
  return readFile(projectFile(path), "utf8");
}

test("menyediakan route utama mission: login, register, dan home", async () => {
  const [indexPage, loginPage, registerPage, homePage] = await Promise.all([
    source("app/page.tsx"),
    source("app/login/page.tsx"),
    source("app/register/page.tsx"),
    source("app/home/page.tsx"),
  ]);

  assert.match(indexPage, /redirect\("\/login"\)/);
  assert.match(loginPage, /<AuthPage mode="login"\s*\/>/);
  assert.match(registerPage, /<AuthPage mode="register"\s*\/>/);
  assert.match(homePage, /<HomePage\s*\/>/);
});

test("form autentikasi memakai komponen reusable dan props", async () => {
  const [authPage, formField, brandLogo] = await Promise.all([
    source("app/components/AuthPage.tsx"),
    source("app/components/FormField.tsx"),
    source("app/components/BrandLogo.tsx"),
  ]);

  assert.match(authPage, /type AuthPageProps/);
  assert.match(authPage, /mode: "login" \| "register"/);
  assert.match(authPage, /<FormField[\s\S]*name="username"/);
  assert.match(authPage, /name="password"/);
  assert.match(authPage, /name="confirmPassword"/);
  assert.match(authPage, /google\.webp/);
  assert.match(formField, /InputHTMLAttributes<HTMLInputElement>/);
  assert.match(formField, /Tampilkan kata sandi/);
  assert.match(formField, /Sembunyikan kata sandi/);
  assert.match(formField, /eyeopen\.png/);
  assert.match(formField, /eyeclose\.png/);
  assert.match(brandLogo, /type BrandLogoProps/);
});

test("home tersusun dari komponen hierarkis dan data katalog terpisah", async () => {
  const [homePage, hero, catalog, chrome, mediaData] = await Promise.all([
    source("app/components/HomePage.tsx"),
    source("app/components/Hero.tsx"),
    source("app/components/MediaCatalog.tsx"),
    source("app/components/SiteChrome.tsx"),
    source("app/data/media.ts"),
  ]);

  assert.match(homePage, /<SiteHeader active="home"/);
  assert.match(homePage, /<Hero\s*\/>/);
  assert.equal((homePage.match(/<MediaRow/g) ?? []).length, 4);
  assert.match(homePage, /<SiteFooter\s*\/>/);
  assert.match(hero, /Duty After School/);
  assert.match(hero, /export function SoundToggle/);
  assert.match(catalog, /export function MediaRow/);
  assert.match(catalog, /items\.map/);
  assert.match(chrome, /export function SiteHeader/);
  assert.match(chrome, /export function SiteFooter/);
  assert.match(mediaData, /export const continueWatching/);
  assert.match(mediaData, /export const trending/);
  assert.match(mediaData, /export const newReleases/);
});

test("stylesheet dipisahkan dan memiliki breakpoint responsive", async () => {
  const [globals, base, auth, home, pages, footer, responsive] = await Promise.all([
    source("app/globals.css"),
    source("app/styles/base.css"),
    source("app/styles/auth.css"),
    source("app/styles/home.css"),
    source("app/styles/pages.css"),
    source("app/styles/footer.css"),
    source("app/styles/responsive.css"),
  ]);

  for (const stylesheet of ["base", "auth", "home", "pages", "footer", "responsive"]) {
    assert.match(globals, new RegExp(`styles/${stylesheet}\\.css`));
  }
  assert.match(base, /font-family: "Lato"/);
  assert.match(auth, /\.auth-card/);
  assert.match(home, /\.carousel__track/);
  assert.match(pages, /\.profile-page/);
  assert.match(footer, /\.footer__inner/);
  assert.match(responsive, /@media \(max-width: 900px\)/);
  assert.match(responsive, /@media \(max-width: 680px\)/);
  assert.match(responsive, /@media \(max-width: 480px\)/);
  assert.match(responsive, /\.carousel__arrow[^}]*display: grid/s);
});

test("aset visual utama Chill tersedia", async () => {
  const assets = [
    "public/assets/img/Logo.png",
    "public/assets/img/avatar.png",
    "public/assets/img/bgmasuk.jpg",
    "public/assets/img/bgdaftar.jpg",
    "public/assets/img/bgberanda.png",
    "public/assets/img/eyeopen.png",
    "public/assets/img/eyeclose.png",
    "public/assets/img/google.webp",
    "public/assets/img/arrow-left.png",
    "public/assets/img/arrow-right.png",
  ];

  await Promise.all(assets.map((asset) => access(projectFile(asset))));
});

test("build produksi menghasilkan Worker dan aset client", async () => {
  await Promise.all([
    access(projectFile("dist/server/index.js")),
    access(projectFile("dist/server/wrangler.json")),
    access(projectFile("dist/client/assets/img/Logo.png")),
    access(projectFile("dist/.openai/hosting.json")),
  ]);
});
