import React from 'react';
import { TouchableOpacity } from 'react-native';

const NavLinkButton = ({ to, children, style }, context) => {

  let pressHandler = to;

  // If the path is a route we make sure to transition there
  if (typeof to === 'string') {
    pressHandler = () => context.router.transitionTo(to);
  }

  return (
    <TouchableOpacity
      onPress={() => pressHandler()}
      style={style}
    >
      {children}
    </TouchableOpacity>
  );
};

NavLinkButton.contextTypes = { router: React.PropTypes.object };

export default NavLinkButton;
