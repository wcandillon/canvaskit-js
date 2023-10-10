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
const image = await CanvasKit.MakeImageFromURIAsync(url);
```


