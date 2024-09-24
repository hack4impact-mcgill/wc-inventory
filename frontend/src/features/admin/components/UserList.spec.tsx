import { render, screen } from "@testing-library/react";
import UserList from "./UserList";
import { useUsers } from "../../../hooks/useUsers";

jest.mock("../../../hooks/useUsers");

describe("UserList Component", () => {
    test("renders loading spinner while fetching", () => {
        (useUsers as jest.Mock).mockReturnValue({ isLoading: true });
        render(<UserList />);
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    test("renders error message on error", () => {
        (useUsers as jest.Mock).mockReturnValue({
            isLoading: false,
            isError: true,
            error: { message: "Failed to fetch users" },
        });
        render(<UserList />);
        expect(screen.getByText(/failed to fetch users/i)).toBeInTheDocument();
    });

    test("renders list of users", async () => {
        (useUsers as jest.Mock).mockReturnValue({
            isLoading: false,
            isError: false,
            data: [{ id: "1", username: "user1" }, { id: "2", username: "user2" }],
        });

        render(<UserList />);
        expect(screen.getByText(/user1/i)).toBeInTheDocument();
        expect(screen.getByText(/user2/i)).toBeInTheDocument();
    });
});
