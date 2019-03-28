
import React from "react"

import SingUp from '../components/SingUp'


class Main extends Component {


    render() {
      return (
        <div>
     <SingUp/>
        </div>
      )
    }
  }
  
  const mapStateToProps = (state) => ({
    
  })
  
  const mapDispatchToProps = {
    
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(Main)
  
  