// pages/robots.txt.jsx
export default function Robots() {
    return (
      <>
        User-agent: *
        Disallow: /
      </>
    );
  }
  
  export async function getServerSideProps({ res }) {
    res.setHeader('Content-Type', 'text/plain');
    res.write('User-agent: *\nDisallow: /');
    res.end();
    return { props: {} };
  }
  