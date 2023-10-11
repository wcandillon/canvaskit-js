# Image

Image decoding in CanvasKitJS is asynchronous.
Instead of using `MakeImageFromEncoded`, you can use `MakeImageFromEncodedAsync`
This means that the following method:
```tsx
const image = Canvas.MakeImageFromEncoded(bytes, imageFormat);
```

becomes:
```tsx
const image = await CanvasKit.MakeImageFromEncodedAsync(bytes, imageFormat);
```

For convenience, we also provide the following method:
```tsx
const image = await CanvasKit.MakeImageFromURIAsync(uri);
```

## With React Native Skia

React Native Skia only provides synchrous image decoding.
This means that you will need to create your own CanvasKit `Image` object and then create an `SkImage` object from it via the `JsiSkImage` class.
The `JsiSkImage` class has two constructor parameters: the CanvasKit instance running and the `Image` object.
This class is exported from `v0.1.213` onwards.

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

React Native Skia app often use the `useImage` hook to load images.
This hook won't work with CanvasKitJS.
In the example below, we check if the app is running CanvasKitWASM or CanvasKitJS and load the image accordingly.

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

