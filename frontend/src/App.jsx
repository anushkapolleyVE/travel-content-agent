import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Feeds from "./pages/Feeds";
import Drafts from "./pages/Drafts";
import Queue from "./pages/Queue";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/feeds"
          element={
            <Layout>
              <Feeds />
            </Layout>
          }
        />
        <Route
          path="/drafts"
          element={
            <Layout>
              <Drafts />
            </Layout>
          }
        />
        <Route
          path="/queue"
          element={
            <Layout>
              <Queue />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
