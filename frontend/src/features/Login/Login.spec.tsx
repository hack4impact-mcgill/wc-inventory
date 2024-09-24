import { render, screen, fireEvent, act } from "@testing-library/react";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { Login } from "./Login";

const mockLogin = jest.fn();

const renderWithRouter = (ui: JSX.Element) => {
    const mockAuthContext: AuthContextType = {
        login: mockLogin,
        user: null,
        logout: jest.fn(),
        isAuthenticated: false,
        isLoading: false
    };
    return render(
        <AuthContext.Provider value={mockAuthContext}>
            <BrowserRouter>{ui}</BrowserRouter>
        </AuthContext.Provider >
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
