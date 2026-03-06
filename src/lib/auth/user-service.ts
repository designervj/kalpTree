import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { getDatabase } from "../db/mongodb";
import type { User } from "@/types";

export class UserService {
  private async getCollection() {
    const db = await getDatabase();
    return db.collection<User>("users");
  }

  async getUserByEmail(
    // tenantId: string | ObjectId,
    email: string
  ): Promise<User | null> {
    const collection = await this.getCollection();
    // const tid = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId;
    const response = await collection.findOne({
      // tenantId: tid,
      email: email.toLowerCase(),
    });
    // console.log("get user by Emnmails---", response);
    return response;
  }

  async getUserById(id: string | ObjectId): Promise<User | null> {
    const collection = await this.getCollection();
    const objectId = typeof id === "string" ? new ObjectId(id) : id;
    return collection.findOne({ _id: objectId });
  }

  async createUser(data: {
    tenantId: string | ObjectId;
    email: string;
    password: string;
    name?: string;
    role: string;
    createdById: string;
  }): Promise<User> {
    const collection = await this.getCollection();

    const existing = await this.getUserByEmail(data.email);

    const db = await getDatabase();
    const coll = await db.collection("roles");
    const findPermissions = await coll.findOne({ code: data.role });

    if (existing) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);
    const createdByObjectId = new ObjectId(data.createdById);
    const user: Omit<User, "_id"> = {
      tenantId: data.tenantId,
      email: data.email.toLowerCase(),
      passwordHash,
      name: data.name!,
      role: data.role,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: findPermissions!.permissions,
      createdById: createdByObjectId,
    };

    const result = await collection.insertOne(user as User);
    return { ...user, _id: result.insertedId } as User;
  }

  async createSingleUser(data: {
    // tenantId: string | ObjectId;
    email: string;
    password: string;
    name: string;
    role: string;
    permissions: string[];
    createdById: string;
  }): Promise<User> {
    const collection = await this.getCollection();

    const existing = await this.getUserByEmail(data.email);

    if (existing) {
      throw new Error("User with this email already exists");
    }
    const passwordHash = await bcrypt.hash(data.password, 10);

    const newObjectId = new ObjectId(data.createdById);

    const user: Omit<User, "_id"> = {
      email: data.email.toLowerCase(),
      passwordHash,
      name: data.name,
      role: data.role,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: data.permissions,
      createdById: newObjectId,
    };

    const result = await collection.insertOne(user as User);
    return { ...user, _id: result.insertedId } as User;
  }

  async createwithemail(data: {
    tenantId: string | ObjectId;
    email: string;
    role: string;
    permissions: string[];
    createdById: string;
    managedServices: any;
  }): Promise<User> {
    const collection = await this.getCollection();

    const existing = await this.getUserByEmail(data.email);

    if (existing) {
      throw new Error("User with this email already exists");
    }

    const newObjectId = new ObjectId(data.createdById);

    const user: Omit<User, "_id"> = {
      email: data.email.toLowerCase(),
      role: data.role,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: data.permissions,
      createdById: newObjectId,
      managedServices: data.managedServices,
      tenantId: data.tenantId,
    };

    const result = await collection.insertOne(user as User);
    return { ...user, _id: result.insertedId } as User;
  }

  async updatepasswordafterverification(data: {
    name: string;
    password: string;
    id: ObjectId;
  }): Promise<any> {
    const collection = await this.getCollection();
    const passwordHash = await bcrypt.hash(data.password, 10);
    const result = await collection.updateOne(
      { _id: data.id },
      {
        $set: {
          name: data.name,
          passwordHash: passwordHash,
        },
      }
    );

    // const result = await collection.insertOne(user as User);
    return result;
  }

  async createsuperadminUser(data: {
    email: string;
    password: string;
  }): Promise<User> {
    const collection = await this.getCollection();
    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    const user: Omit<any, "_id"> = {
      email: data.email.toLowerCase(),
      passwordHash,
      role: "superadmin",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: {
        dashboard: true,
        users: [],
        tenants: [],
        products: [],
        orders: [],
        content: [],
        settings: [],
      },
    };

    const result = await collection.insertOne(user as User);
    return { ...user, _id: result.insertedId } as User;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash!);
  }

  async updateLastLogin(userId: string | ObjectId): Promise<void> {
    const collection = await this.getCollection();
    const id = typeof userId === "string" ? new ObjectId(userId) : userId;

    await collection.updateOne(
      { _id: id },
      {
        $set: {
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );
  }

  async listUsers(tenantId: string | ObjectId): Promise<User[]> {
    const collection = await this.getCollection();
    const tid =
      typeof tenantId === "string" ? new ObjectId(tenantId) : tenantId;
    return collection.find({ tenantId: tid }).sort({ createdAt: -1 }).toArray();
  }
}

export const userService = new UserService();
