import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./features/shared/Components/layouts/MainLayout";
import  { SubCategoryPage } from "./features/Categories/ui/pages/SubCategoryPage";
import { TransactionsPage } from "./features/Transaction/UI/pages/TransactionsPage";

function App() {
 return (
    <BrowserRouter>
      <Routes>
        <Route path="/transactions" element={<MainLayout><TransactionsPage /></MainLayout>} />
        <Route path="/categories" element={<MainLayout><SubCategoryPage  /></MainLayout>} />
        
        <Route path="*" element={<MainLayout><SubCategoryPage /></MainLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
