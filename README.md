# Iphoto API

![Repo Size][repo-size]
![Top Languages][top-languages]
![Repo License][repo-license]

This is a API REST for Iphoto application

## Get Started

Install dependencies:

```
yarn

npm install
```

Pre-steps:

1. Run a Postgres database and put crendetials in .env
2. Create a bucket in AWS S3 to use in, and put credentials in .env

Development:

```sh
npm run start:dev

yarn start:dev
```

Production:

```sh
npm start

yarn start
```

Build:

```sh
npm run build

yarn build
```

## About

- This is a API Rest made in Nest.js with TypeScript for Iphoto application.
- Iphoto is a web app where user can save his photos and manage in albums.

### Technologies

- [Nest.js](https://docs.nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Postgres](https://www.postgresql.org/docs/)
- [Typeorm](https://typeorm.io/#/)
- [AWS S3](https://docs.aws.amazon.com/s3/index.html)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes following the convential commit standard (`git commit -am 'feat: Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<!-- Markdown link & img dfn's -->

[top-languages]: https://img.shields.io/github/languages/top/matheusdoedev/iphoto-api?style=flat-square
[repo-size]: https://img.shields.io/github/repo-size/matheusdoedev/iphoto-api?style=flat-square
[repo-license]: https://img.shields.io/github/license/matheusdoedev/iphoto-api?style=flat-square
