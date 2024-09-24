import { render, screen, fireEvent, act } from "@testing-library/react";
import { AuthContext } from "../../contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { Login } from "./Login";

// Mock context
const mockLogin = jest.fn();

const renderWithRouter = (ui: JSX.Element) => {
    return render(
        <AuthContext.Provider value={{ login: mockLogin, user: null } as any}>
            <BrowserRouter>{ui}</BrowserRouter>
        </AuthContext.Provider>
    );
};

describe("Login Component", () => {
    test("renders login form", () => {
        renderWithRouter(<Login />);
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    test("calls login on form submission", async () => {
        renderWithRouter(<Login />);

        await act(async () => {
            fireEvent.change(screen.getByLabelText(/username/i), {
              target: { value: "testUser" },
            });
            fireEvent.change(screen.getByLabelText(/password/i), {
              target: { value: "testPassword" },
            });
      
            fireEvent.submit(screen.getByRole("button", { name: /sign in/i }));
          }); 


        expect(mockLogin).toHaveBeenCalledWith("testUser", "testPassword");
    });
});
