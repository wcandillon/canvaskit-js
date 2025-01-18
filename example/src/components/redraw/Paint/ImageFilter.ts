import type { BlurProps } from "../imageFilters/Blur";

export interface ImageFilter<Props = unknown> {
  props: Props;
  children: ImageFilter<unknown>[];
}

type ImageFilterProps = BlurProps;

export const makeImageFilter = <Props extends ImageFilterProps>(
  props: Props
): ImageFilter<Props> => ({
  props,
  children: [],
});
