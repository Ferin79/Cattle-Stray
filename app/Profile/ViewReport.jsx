import React from "react";
import {
  Avatar,
  Card,
  Paragraph,
  Subheading,
  Button,
} from "react-native-paper";

const ViewReport = ({ item, themeStyle }) => {
  const LeftContent = (props) => (
    <Avatar.Icon {...props} icon="information-outline" />
  );
  return (
    <Card
      style={{
        elevation: 5,
        marginVertical: 10,
        marginHorizontal: 20,
        backgroundColor: themeStyle.secondaryColor,
      }}
    >
      <Card.Title
        title={item.animalType}
        subtitle={`Count: ${item.animalCount}`}
        left={LeftContent}
        titleStyle={{
          color: themeStyle.textColor,
          textTransform: "capitalize",
        }}
        subtitleStyle={{
          color: themeStyle.textSecondaryColor,
          textTransform: "capitalize",
        }}
      />
      <Card.Content>
        <Subheading
          style={{ color: themeStyle.textColor, textTransform: "capitalize" }}
        >
          Condition: {item.animalCondition}
        </Subheading>
        <Paragraph style={{ color: themeStyle.textColor }}>
          Description: {item.description}
        </Paragraph>
      </Card.Content>

      <Card.Cover source={{ uri: item.animalImageUrl }} />
      <Card.Actions>
        <Button color={themeStyle.textColor} icon="arrow-up-bold">
          {item.upvotes.length}
        </Button>
        <Button color={themeStyle.textColor} icon="arrow-down-bold">
          {item.downvotes.length}
        </Button>
        <Button color={themeStyle.textColor} icon="comment">
          {item.comments.length}
        </Button>
      </Card.Actions>
    </Card>
  );
};

export default ViewReport;
