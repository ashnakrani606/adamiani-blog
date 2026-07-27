import type { PortableTextBlock } from "@portabletext/types";
import type { Lang } from "@/app/lang";

export type LocalizedString = {
  en?: string;
  ru?: string;
  ka?: string;
};

export type LocalizedBlockContent = {
  en?: PortableTextBlock[];
  ru?: PortableTextBlock[];
  ka?: PortableTextBlock[];
};

export type SanityImage = {
  asset?: {
    _ref: string;
    _type: "reference";
  };
  alt?: LocalizedString;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
};

export type Category = {
  _id: string;
  name: LocalizedString;
  slug: string;
};

export type BlogPostListItem = {
  _id: string;
  title: LocalizedString;
  slug: string;
  excerpt: LocalizedString;
  publishDate: string;
  featuredImage?: SanityImage;
  category?: Category | null;
};

export type BlogPost = BlogPostListItem & {
  body: LocalizedBlockContent;
  seoTitle?: LocalizedString;
  seoDescription?: LocalizedString;
};

export type BlogLang = Lang;
