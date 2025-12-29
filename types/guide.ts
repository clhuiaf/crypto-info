export type GuideTag = 'Beginner' | 'Intermediate' | 'Advanced';

export type Guide = {
  id: string;
  slug: string;
  title: string;
  description: string;
  tag: GuideTag;
  metaTitle: string;
  metaDescription: string;
};

