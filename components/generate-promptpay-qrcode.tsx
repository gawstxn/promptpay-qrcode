'use client'

import { QrCode, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useState } from "react"
import Link from "next/link"
import axios from "axios"

export function GeneratePromptPayQRCode({className, ...props}: React.ComponentProps<"div">) {
  const [phone, setPhone] = useState<string>("")
  const [amount, setAmount] = useState<number>()
  const [qrcode, setQrcode] = useState<string>("")
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const isValidPhoneNumber = (phone: string) => {
    // ตรวจจาก Pattern เริ่มด้วย 0 ตามด้วย 6, 8, 9 และตามด้วยเลขอีก 8 ตัว
    const regex = /^0[689]\d{8}$/
    return regex.test(phone)
  }

  const generateQRCode = async () => {
    // Validation
    if (phone === "") return toast.error("กรุณากรอกเบอร์มือถือ")
    if (!isValidPhoneNumber(phone)) return toast.error("เบอร์มือถือไม่ถูกต้อง")
    
    // Fetch
    const res = await axios.post("/api/generate-qr", {phone, amount})
    console.log(res)
    if(res.status === 200) {
      setQrcode(res.data.qrUrl)
      setIsSuccess(true)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md border">
              <QrCode className="size-6" />
            </div>
            <h1 className="text-xl font-bold">Generate Promptpay QRCode</h1>
          </div>

          {/* Input section */}
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="phone">เบอร์มือถือ</Label>
              <Input id="phone" type="text" placeholder="0812345678" onChange={(e) => setPhone(e.target.value)}/>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="amount">จำนวนเงิน</Label>
              <Input id="amount" type="number" placeholder="199.99" onChange={(e) => setAmount(Number(e.target.value))}/>
            </div>
            <Button className="w-full cursor-pointer" onClick={() => generateQRCode()}>
              สร้าง QRCode
            </Button>
            
            {/* Display QRCode */}
            <Dialog open={isSuccess} onOpenChange={() => setIsSuccess(!isSuccess)}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Promptpay QRCode</DialogTitle>
                </DialogHeader>
                {/* Content */}
                {qrcode && (
                  <div className="flex flex-col justify-center gap-2">
                    <img src={qrcode} alt="PromptPay QR" className="border rounded mb-2" />
                    <DialogFooter>
                      <Link href={qrcode} download="promptpay.png" className="w-full">
                        <Button className="w-full cursor-pointer">
                          ดาวน์โหลด QRCode
                        </Button>
                      </Link>
                    </DialogFooter>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      <div className="flex items-center justify-center text-muted-foreground text-center text-xs">
        Made with <Heart size={12} className="mx-1"/> by <Link href={"https://github.com/gawstxn"} className="mx-1 underline">gawstxn</Link>
      </div>
    </div>
  )
}
