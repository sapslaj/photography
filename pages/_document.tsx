import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="sapslaj photography"
          />
          <meta property="og:site_name" content="photography.sapslaj.com" />
          <meta
            property="og:description"
            content="sapslaj.photography"
          />
          <meta property="og:title" content="sapslaj photography" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="sapslaj photography" />
          <meta
            name="twitter:description"
            content="sapslaj photography"
          />
        </Head>
        <body className="bg-black antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
