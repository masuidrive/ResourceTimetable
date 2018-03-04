import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    return renderPage();
  }

  render() {
    return (
      <html>
        <Head>
          <title>Google Calendar Resources</title>
        </Head>
        <body>
          <Main />
          <script src="https://apis.google.com/js/api.js"></script>
          <NextScript />
        </body>
      </html>
    )
  }
}