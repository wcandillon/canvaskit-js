# Image

In CanvasKitJS, image decoding is asynchronous. Instead of using `MakeImageFromEncoded`, you can opt for `MakeImageFromEncodedAsync`. This transforms the following method:

```tsx
const image = Canvas.MakeImageFromEncoded(bytes, imageFormat);
```

into:

```tsx
const image = await CanvasKit.MakeImageFromEncodedAsync(bytes, imageFormat);
```

For added convenience, we also offer:

```tsx
const image = await CanvasKit.MakeImageFromURIAsync(uri);
```

## With React Native Skia

React Native Skia provides only synchronous image decoding. This means you'll have to create your own CanvasKit `Image` object and subsequently generate an `SkImage` object from it using the `JsiSkImage` class. The `JsiSkImage` class requires two constructor parameters: the active CanvasKit instance and the `Image` object. This class is available from version `v0.1.213` onwards.

```tsx
import {JsiSkImage, Canvas, Image} from "@shopify/react-native-skia";

const image = await CanvasKit.MakeImageFromURIAsync(uri);
const skImage = new JsiSkImage(CanvasKit, image);
return (
  <Canvas style={{ width, height }}>
    <Image image={skImage} x={0} y={0} width={width} height={height} />
  </Canvas>
)
```

Apps using React Native Skia frequently employ the `useImage` hook for image loading. This hook is incompatible with CanvasKitJS. In the example below, we determine whether the app is running on CanvasKitWASM or CanvasKitJS and load the image accordingly.

```tsx
import {useImage, SkImage, JsiSkImage} from "@shopify/react-native-skia";

const useWebImage = !CanvasKit.polyfill ? useImage : (uri: string) => {
  const [image, setImage] = useState<null | SkImage>(null);
  useEffect(() => (async () => {
    const image = await CanvasKit.MakeImageFromURIAsync(uri);
    const skImage = new JsiSkImage(CanvasKit, image);
    setImage(skImage);
  })(), []);
  return image;
};
```