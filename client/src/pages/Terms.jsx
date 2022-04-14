import React from "react";

import { Box, Typography } from "@mui/material";

const Terms = () => {
  return (
    <>
      <Box px={{ xs: 2, sm: 10, lg: 20 }} py={4}>
        <Typography variant="h4" mb={1}>
          Terms and Conditions for Sunday Markets
        </Typography>

        <Typography variant="body1" mb={5} fontWeight="bold">
          Last updated April 05, 2022
        </Typography>

        <Typography variant="h5" mb={5}>
          Our aim in providing our Services is to make life better for smaller
          businesses and individuals. We provide an online venue to allow
          Members to advertise all sorts of Items. In providing this service, we
          don't participate in the actual sale of Items or the transaction
          itself. We don't own any Items listed on our Site and don't offer them
          for sale, nor do we act as an agent for either party. We also don't
          take part in the actual provision of Member Services.
        </Typography>

        <Typography variant="h6" mb={0}>
          Safety and Trustworthyness
        </Typography>
        <Typography variant="body1" mb={3}>
          Our Members will only use Sunday Markets if they trust other Members
          and feel confident in the Sunday Markets community. Our team is
          committed to making Sunday Markets a safe online marketplace. While we
          don't pre-screen Listings or monitor our entire Site, if we become
          aware of any misuse of our Services, we'll take the appropriate
          action. This could be issuing a warning, removing content, disabling
          an account, banning a Member, or contacting the relevant authority.
          Some examples of the kind of misuse we'd take action over are:
          illegal, stolen or unsafe Items; Listings that do not comply with New
          Zealand law or that infringe intellectual property rights; or harmful
          or offensive conduct. We may also limit your activities that puts our
          community or systems at risk. You agree that we may disclose your
          personal information in accordance with our privacy policy.
        </Typography>

        <Typography variant="h6" mb={0}>
          Intellectual Property
        </Typography>
        <Typography variant="body1" mb={3}>
          We retain all of our intellectual property rights, including our
          rights in the software and source code used, to provide the Site and
          Services. You may not adapt, reproduce, copy, store, distribute,
          publish or create derivative works from any part of the Site, or
          commercialise or on-sell any information obtained from the Site or our
          Services, without our prior written consent.
        </Typography>

        <Typography variant="h6" mb={0}>
          Changes to Services
        </Typography>
        <Typography variant="body1" mb={3}>
          We are constantly changing and improving our Site and Services. We may
          add or remove features or functions and we may suspend or stop
          providing a Service altogether.
        </Typography>

        <Typography variant="h6" mb={0}>
          Membership
        </Typography>
        <Typography variant="body1" mb={3}>
          It's free to become a Member of Sunday Markets, but we do have some
          eligibility terms. <br />
          To become a Member you must:
          <li>be at least 18 years old and able to enter into contracts</li>
          <li>
            complete the registration process and provide true, correct and
            up-to-date information.
          </li>
          We may allow you to register or log-in to some of our Services with a
          third party service (e.g. Facebook or Google), in which case we will
          access, store and use your information from that service, subject to
          their terms.
          <br />
          You can't register as a Member under multiple identities, personas, or
          aliases (whether they are false or not).
        </Typography>

        <Typography variant="h6" mb={0}>
          Maintaining your membership
        </Typography>
        <Typography variant="body1" mb={3}>
          You must maintain and update your personal and account information, to
          ensure it's always current and correct. We may contact you to verify
          your details. You're responsible for all the activity that happens on
          your account. To protect it, keep your login information secret and
          secure, change your password regularly, and don't let anyone else use
          your membership.
        </Typography>

        <Typography variant="h6" mb={0}>
          How we communicate with each other
        </Typography>
        <Typography variant="body1" mb={3}>
          We may contact you about your membership, your transactions and any
          other activities on the Site. Subject to your email preferences, we
          may contact you with information or promotions about our other
          Services that we think you'll be interested in.
        </Typography>

        <Typography variant="h6" mb={0}>
          Terminating your membership
        </Typography>
        <Typography variant="body1" mb={3}>
          You may terminate your membership at any time, for any reason. We'll
          need around three days to process your request. Similarly, we may
          refuse to offer some or all of our Services to you without prior
          notice, for any reason. If we have restricted or prohibited your
          access to our Services, we will have done this for a reason and, if we
          can, we'll tell you why. You agree not to bypass these controls, for
          example, you agree not to create a new membership. If we have
          explained why your access to our Services has been restricted or
          prohibited, we reserve the right to cease further correspondence with
          you. If your membership is terminated (by you or by us), your ability
          to access our Site will end and you must stop using our Services.
          Certain clauses from these Terms will continue to apply after
          termination.If you visit our Site after termination, or otherwise use
          our Services, these Terms will apply.
        </Typography>
      </Box>
    </>
  );
};

export default Terms;
