    const nextConfig = {
      async redirects() {
        return [
          {
            source: '/',
            destination: '/dashboard',
            permanent: true, // Set to true for a 301 permanent redirect
          },
        ];
      },
    };

    module.exports = nextConfig;