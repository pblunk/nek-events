import { AnyGuideItem } from '@/types/guide';

export function getGuideItemImage(item: AnyGuideItem) {
  return {
    imageUrl: item.imageUrl,
    imageCredit: item.imageCredit,
    imageSource: item.imageSource,
  };
}
