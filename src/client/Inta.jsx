import 'intasend-inlinejs-sdk'
import '../inta.css'

function MyScreen(){
  
  new window.IntaSend({
    publicAPIKey: "ISPubKey_test_73158406-58db-43d2-8b6d-4e1c2b391929",
    live: false //or true for live environment
  })
  .on("COMPLETE", (response) => { console.log("COMPLETE:", response) })
  .on("FAILED", (response) => { console.log("FAILED", response) })
  .on("IN-PROGRESS", () => { console.log("INPROGRESS ...") })

  return(
    <div>
      <input type="text" placeholder="Amount"  />
            <input type="text" placeholder="Phone Number" />
        <button className="intaSendPayButton" data-amount="10" data-currency="KES">Pay via M-PESA</button>
    </div>
  )
  
  
}


export default MyScreen


