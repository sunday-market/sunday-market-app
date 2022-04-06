import { Typography, Box } from "@mui/material";

const Privacy = () => {
  return (
    <Box px={{ xs: 2, sm: 10, lg: 20 }} py={4}>
      <Typography variant="h4" mb={1}>
        Privacy notice for Sunday Markets
      </Typography>
      <Typography variant="h5" mb={5}>
        This notice explains how and when Sunday Makets collects personal
        information, what we do with it and your right to see or change it.
      </Typography>

      <Typography variant="h6" mb={0}>
        Purpose
      </Typography>
      <Typography variant="body1" mb={3}>
        The purpose of this privacy notice is to let users of Sunday Markets
        (the 'site') know when we collect personal information and what we do
        with it. We do not use, share or transfer personal information in
        connection with the site except as set out in this notice, or as
        otherwise set out somewhere on the site (including in terms linking to
        the site). Terms of use
      </Typography>

      <Typography variant="h6" mb={0}>
        Use of personal information
      </Typography>
      <Typography variant="body1" mb={3}>
        We will only use personal information provided to us for the purpose of:
        <li>administering, evaluating and improving the site</li>
        <li>improving our services</li>
        <li>
          responding to your feedback and information provided in forms and
          surveys
        </li>
        <li>conducting user research if you registered to participate.</li>
      </Typography>

      <Box
        backgroundColor="#e0e0e0"
        p={2}
        sx={{ borderLeft: "solid 3px #0582ca" }}
      >
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          No need to disclose personal information
        </Typography>

        <Typography variant="body1">
          You can use the site — including completing some user research tasks —
          without sharing any personal information.
        </Typography>
      </Box>

      <Typography variant="h6" mb={0}>
        Sharing your personal information
      </Typography>
      <Typography variant="body1" mb={3}>
        You may choose to share personal information with us when you:
        <li>give feedback</li>
        <li>complete survey or feedback forms</li>
        <li>participate in user research.</li>
        Do not send us sensitive personal information or include it in feedback
        forms or surveys.
      </Typography>

      <Typography variant="h6" mb={0}>
        Feedback you provide
      </Typography>
      <Typography variant="body1" mb={3}>
        Feedback is important and is used to evaluate and improve the site. If
        you provide feedback by email, that feedback is sent to Sunday Markets
        staff. We may pass on relevant comments to other people who administer
        or contribute content to the site. This could include your email address
        and other identifying information that you have provided.
      </Typography>

      <Typography variant="h6" mb={0}>
        Storage and deletion of information
      </Typography>
      <Typography variant="body1" mb={3}>
        If you provide personal information, it is held securely by Sunday
        Makets and will not be retained once the insights have been documented
        and is no longer needed. It may be shared with third-party contractors
        to the extent necessary for them to administer or work on the site, or
        to work on special projects with us. Email addresses are not made
        available to the public. Unless required by law, we will not disclose
        the names or email addresses of individuals who provide feedback to us
        or who provide us with submission forms without their consent.
      </Typography>

      <Typography variant="h5" mb={0}>
        Access and correct your personal information
      </Typography>
      <Box
        backgroundColor="#e0e0e0"
        p={2}
        sx={{ borderLeft: "solid 3px #0582ca" }}
      >
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          Changing your Information
        </Typography>

        <Typography variant="body1">
          If you have an account with Sunday Markets you can update your
          information directly in the My Account page. Your previous information
          may still be available against any orders created or previous
          activity.
        </Typography>
      </Box>

      <Typography variant="h6" mb={0}>
        Your rights
      </Typography>
      <Typography variant="body1" mb={3}>
        Under the Privacy Act 2020, you have the right to access and ask us to
        correct any personal information you have provided to us. <br />
        Contact us if:
        <li>you would like to access or change your personal information</li>
        <li>you have any concerns regarding your privacy.</li>
        Sunday Markets may require proof of your identity before being able to
        provide you with any personal information.
      </Typography>

      <Typography variant="h6" mb={0}>
        Privacy Officer
      </Typography>
      <Typography variant="body1" mb={3}>
        If you have any concerns about how Sunday Markets manages your personal
        information, you may contact the Privacy Officer.
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        Privacy Officer contact details
      </Typography>
      <Typography variant="body1" mb={3}>
        Email: SundayMarketsApp@gmail.com
      </Typography>
      <Typography variant="body1" mb={3}>
        If you are not satisfied with our response to any privacy-related
        concern you may have, you can contact the Privacy Commissioner and make
        a privacy complaint.
      </Typography>
    </Box>
  );
};

export default Privacy;
