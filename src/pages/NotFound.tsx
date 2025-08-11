import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>404 | Page non trouvée</title>
        <meta name="description" content="La page demandée est introuvable." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">404</h1>
          <p className="text-lg text-muted-foreground mb-6">Oops! Page non trouvée</p>
          <Link to="/" className="underline underline-offset-4 text-primary">Retour à l'accueil</Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
