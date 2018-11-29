import React from "react";
import createMediaListener from "./lib/createMediaListener";
import { Galaxy, Trees, Earth } from "./lib/screens";

const defaultMediaQueries = {
  big: "(min-width : 1000px)",
  tiny: "(max-width: 600px)"
};

class Media extends React.Component {
  media = createMediaListener(this.props.queries);

  state = {
    media: this.media.getState()
  };

  componentDidMount() {
    this.media.listen(media => this.setState({ media }));
  }

  componentWillUnmount() {
    this.media.dispose();
  }

  render() {
    return this.props.children(this.state.media);
  }

}

export default () => { 
  const query1 = { big: "(min-width : 1000px)", tiny: "(max-width: 200px)" }
  const query2 = { big: "(min-width : 900px)", tiny: "(max-width: 700px)" }
  return ( <Media queries={query1}>
    {
      media => (
      <div>
        {media.big ? (
          <Galaxy key="galaxy" />
        ) : media.tiny ? (
          <Trees key="trees" />
        ) : (
          <Earth key="earth" />
        )}
      </div>
      )
    }
  </Media> )
  };
