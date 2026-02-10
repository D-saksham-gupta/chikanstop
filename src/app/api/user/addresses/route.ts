import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// GET /api/user/addresses - Get all addresses
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(session.user.id).select("address");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user.address || [] });
  } catch (error) {
    console.error("Get addresses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 },
    );
  }
}

// POST /api/user/addresses - Add new address
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    await dbConnect();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If this is the first address or marked as default, set it as default
    if (body.isDefault || !user.address || user.address.length === 0) {
      // Remove default from all other addresses
      user.address =
        user.address?.map((addr: any) => ({
          ...addr,
          isDefault: false,
        })) || [];
      body.isDefault = true;
    }

    user.address = [...(user.address || []), body];
    await user.save();

    return NextResponse.json({
      success: true,
      data: user.address,
      message: "Address added successfully",
    });
  } catch (error) {
    console.error("Add address error:", error);
    return NextResponse.json(
      { error: "Failed to add address" },
      { status: 500 },
    );
  }
}

// PUT /api/user/addresses - Update address
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { addressId, ...addressData } = body;

    await dbConnect();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const addressIndex = user.address?.findIndex(
      (addr: any) => addr._id.toString() === addressId,
    );

    if (addressIndex === -1 || addressIndex === undefined) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // If setting as default, remove default from others
    if (addressData.isDefault) {
      user.address = user.address?.map((addr: any, idx: number) => ({
        ...addr,
        isDefault: idx === addressIndex,
      }));
    }

    user.address[addressIndex] = {
      ...user.address[addressIndex],
      ...addressData,
    };
    await user.save();

    return NextResponse.json({
      success: true,
      data: user.address,
      message: "Address updated successfully",
    });
  } catch (error) {
    console.error("Update address error:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 },
    );
  }
}

// DELETE /api/user/addresses - Delete address
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const addressId = searchParams.get("id");

    if (!addressId) {
      return NextResponse.json(
        { error: "Address ID required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.address = user.address?.filter(
      (addr: any) => addr._id.toString() !== addressId,
    );

    await user.save();

    return NextResponse.json({
      success: true,
      data: user.address,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 },
    );
  }
}
