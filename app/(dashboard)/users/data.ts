import { faker } from "@faker-js/faker";

export type UserStatus = "active" | "inactive" | "invited" | "suspended";
export type UserRole = "superadmin" | "admin" | "manager" | "cashier";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  status: UserStatus;
  role: UserRole;
  createdAt: Date;
};

export const userStatuses = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "invited", label: "Invited" },
  { value: "suspended", label: "Suspended" },
] as const;

export const userRoles = [
  { value: "superadmin", label: "Superadmin" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "cashier", label: "Cashier" },
] as const;

export const statusColors: Record<UserStatus, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  invited: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  suspended: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

function generateUsers(count: number): User[] {
  return Array.from({ length: count }, () => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
      id: faker.string.uuid(),
      firstName,
      lastName,
      username: faker.internet
        .username({ firstName, lastName })
        .toLowerCase(),
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phoneNumber: faker.phone.number(),
      status: faker.helpers.arrayElement([
        "active",
        "inactive",
        "invited",
        "suspended",
      ]) as UserStatus,
      role: faker.helpers.arrayElement([
        "superadmin",
        "admin",
        "manager",
        "cashier",
      ]) as UserRole,
      createdAt: faker.date.past(),
    };
  });
}

export const users = generateUsers(100);
