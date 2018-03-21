import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    return renderPage();
  }

  render() {
    return (
      <html>
        <Head>
          <meta name="viewport" content="width=device-width"/>
          <title>Google Calendar Resources</title>
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
          <link rel="stylesheet" href={`${process.env.DEPLOY_PREFIX || ''}/_next/static/style.css`} />
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