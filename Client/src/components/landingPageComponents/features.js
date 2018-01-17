import React from 'react'
import { Image, Item, Grid } from 'semantic-ui-react';


const Features = () => (

<Grid container relaxed centered doubling stackable style={{paddingTop:'40px'}}>

  <Grid.Row style={{paddingTop:'20px'}}>
   <Grid.Column width={8}>
      <Item.Group>
        <Item>
          <Item.Image size='tiny' src="../../../public/img/1.png" />
          <Item.Content>
            <Item.Header >Brilliant ideas go fast</Item.Header>
            <Item.Description>
              Type all of your ideas in one place in order to make them real.
            </Item.Description>
          </Item.Content>
        </Item>
      </Item.Group>
    </Grid.Column>

    <Grid.Column width={8}>
      <Item.Group>
        <Item>
          <Item.Image size='tiny' src="../../../public/img/2.png"  />
          <Item.Content>
            <Item.Header >Do not miss any stakeholder</Item.Header>
            <Item.Description>
             We will help you finding your potential stakeholders depending on keywords you provide, brainstorming is fine but not enough.
            </Item.Description>
          </Item.Content>
        </Item>
      </Item.Group>
    </Grid.Column>
   </Grid.Row>

    <Grid.Row>

      <Grid.Column width={8}>
        <Item.Group>
          <Item>
            <Item.Image size='tiny' src="../../../public/img/3.png"  />
            <Item.Content>
              <Item.Header >Analyze before it is late</Item.Header>
              <Item.Description>
                With help of our intelligence algorithms and successful approachs you will see your stakeholders from different points of view.
              </Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Grid.Column>

      <Grid.Column width={8}>
       <Item.Group>
        <Item>
          <Item.Image size='tiny' src="../../../public/img/4.png"  />
          <Item.Content>
            <Item.Header >Support your project plan</Item.Header>
            <Item.Description>
              Download the results of Stakeholder analysis in order to add it to your project plan.
            </Item.Description>
          </Item.Content>
        </Item>
        </Item.Group>
      </Grid.Column>
   </Grid.Row>

   <Grid.Row>

     <Grid.Column width={8}>
      <Item.Group>
       <Item>
         <Item.Image size='tiny' src="../../../public/img/5.png"  />
         <Item.Content>
           <Item.Header >User friendly Interface</Item.Header>
           <Item.Description>
             We help you invest more on understanding your Stakeholders than just learning our application.
           </Item.Description>
         </Item.Content>
       </Item>
      </Item.Group>
     </Grid.Column>

     <Grid.Column width={8}>
      <Item.Group>
        <Item>
          <Item.Image size='tiny' src="../../../public/img/6.png"  />
          <Item.Content>
            <Item.Header >Integrate with Call for Proposal</Item.Header>
            <Item.Description>
              Industry standards into the future of your industry before competitors.
            </Item.Description>
          </Item.Content>
        </Item>
      </Item.Group>
     </Grid.Column>

   </Grid.Row>
</Grid>

);

export default Features
