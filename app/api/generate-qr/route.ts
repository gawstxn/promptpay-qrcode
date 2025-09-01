import { NextResponse } from "next/server"
import generatePayload from "promptpay-qr"
import QRCode from "qrcode"

export async function POST(req: Request) {
  try {
    const { phone, amount } = await req.json()
    if (!phone) return NextResponse.json({ error: "กรุณาใส่เบอร์โทร" }, { status: 400 })
    
    // payload PromptPay
    const payload = generatePayload(phone, {amount: amount ? Number(amount) : undefined})
    const qrUrl = await QRCode.toDataURL(payload, {width: 400})

    return NextResponse.json({qrUrl, payload}, {status: 200})
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}