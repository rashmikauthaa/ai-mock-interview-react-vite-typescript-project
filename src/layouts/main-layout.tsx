import Header from "@/components/header";
import { Outlet } from "react-router-dom";
import Footer from "@/components/footer";
import { Container } from "@/components/container";

const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* header */}
      <Header />

      <Container className="flex-grow">
        <main className="flex-grow">
          <Outlet />
        </main>
      </Container>

      {/* footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;