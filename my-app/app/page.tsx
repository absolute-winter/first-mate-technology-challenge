"use client"

import { useState, ChangeEvent } from "react";
import axios from 'axios';


import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Unit = "sec" | "min" | "hr"

export default function Home() {
  const [delay, setDelay] = useState<number>(0);
  const [unit, setUnit] = useState<Unit>('sec');
  const [msg, setMsg] = useState<string>("");
  const [slackUrl, setSlackURL] = useState<string>("");

  const handleDelayChange = (e:ChangeEvent<HTMLInputElement>) => {
    setDelay(parseInt(e.target.value))
  }

  const handleUnitChange = (unit:string) => {
    setUnit(unit as Unit)
  }

  const handleMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMsg(e.target.value)
  }

  const handleSlackURLChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlackURL(e.target.value)
  }

  const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleSendMessage = async() => {
    try {
      switch (unit) {
        case 'sec':
          await sleep(delay*1000)
          break;
        case 'min':
          await sleep(delay*60000)
          break;
        case 'hr':
          await sleep(delay*3600000)
          break;
        default:
          break;
      }

      await axios.post("api/proxy", {
        externalApi: slackUrl,
        text: `From Arden Dave Cabotaje's Slack Bot: ${msg}`
      });
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-[800px] p-6 bg-white shadow-lg rounded-l space-y-3">
        <div className="flex items-center">
          <Label className="min-w-[120px]" htmlFor="delay">Delay</Label>
          <div className="flex items-center grow space-x-2">
            <Input className="grow" id="delay" type="number" placeholder="Amount of Delay" onChange={handleDelayChange}/>
            <Select onValueChange={handleUnitChange}>
              <SelectTrigger className="w-[180px] flex-none">
                <SelectValue placeholder="Select the unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="sec">Seconds</SelectItem>
                  <SelectItem value="min">Minutes</SelectItem>
                  <SelectItem value="hr">Hours</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center">
          <Label className="min-w-[120px]" htmlFor="msg">Message</Label>
          <Textarea id="msg" placeholder="Enter slack message" onChange={handleMessageChange}/>
        </div>
        <div className="flex items-center">
          <Label className="min-w-[120px]" htmlFor="slackHook">Slack Hook URL</Label>
          <Input id="slackHook" type="text" placeholder="Enter Slack Hook URL" onChange={handleSlackURLChange}/>
        </div>
        <Button className="w-full" variant="default" onClick={handleSendMessage}>Send in {delay} {unit}</Button>
      </div>
    </div>
  );
}
