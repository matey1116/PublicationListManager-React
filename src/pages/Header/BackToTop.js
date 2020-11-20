import * as React from "react"
import { Slide, useScrollTrigger } from "@material-ui/core"
const style = {
  position: `fixed`,
  bottom: `50px`,
  right: `100px`,
  zIndex: `99`,
}
const BackToTop = ({ children }) => {
  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    )
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }
  return (
    <Slide direction="left" in={useScrollTrigger()}>
      <div onClick={handleClick} role="presentation" style={style}>
        {children}
      </div>
    </Slide>
  )
}
export default BackToTop