module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      console.log(webpackConfig.node);
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        fallback: {
          ...webpackConfig.resolve.fallback,
          fs: false,
          path: false,
          "react-native/Libraries/Image/AssetRegistry": false,
          "react-native-reanimated": false
        }
      };
      return webpackConfig;
    },
  },
};