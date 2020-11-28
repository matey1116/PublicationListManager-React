import React from 'react'

function QRCodeCard(props) {
    return (
        <div style={{display: "flex", flexDirection:"column", alignItems:"center"}}>
            <img alt="QR Code" style={{margin:"0 auto"}} src={props.imageURL}/>
            <br />
            <Typography variant="body2">
                Open the Google Authentication app and scan the QR code from above.
                The app generates a numerical code, which will be needed when logging in.
                This will make sure your account can be accessed only by you.
                The app is available for Android and IOS devices, and can be downloaded from the following links:
                <Link href="https://apps.apple.com/us/app/google-authenticator/id388497605" target="_blank"><AppleIcon fontSize="small"/></Link>&nbsp;
                <Link href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" target="_blank"><AndroidIcon fontSize="small"/></Link>
            </Typography>
            <TextField
                id="code"
                name="code"
                type="number"
                label="Authentication Code"
                variant="outlined"
                value={this.state.code}
                onChange={this.handleChange}
                helperText={this.state.errors.code}
                error={this.state.errors.code ? true : false}
                style={{marginTop:"10px"}}
            />
        </div>
    )
}

export default QRCodeCard
