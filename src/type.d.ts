declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.ttf";
declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}
declare const fetch;
