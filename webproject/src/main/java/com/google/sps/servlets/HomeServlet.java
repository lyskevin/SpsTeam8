package com.google.sps.servlets;

import com.google.sps.authentication.AuthenticationHandler;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;

/**
 * A servlet which manages entry into the home page of the website.
 */
@WebServlet("/home")
public class HomeServlet extends HttpServlet {
    private final AuthenticationHandler authenticationHandler;

    /**
     * Constructs an instance of the HomeServlet class.
     */
    public HomeServlet() {
        authenticationHandler = new AuthenticationHandler();
    }

    /**
     * Called by the server to allow this servlet to handle a GET request from the home page.
     * @param request An HttpServletRequest object that contains the request the client has made of the servlet.
     * @param response An HttpServletResponse object that contains the response the servlet sends to the client.
     * @throws IOException If an input or output error is detected when the servlet handles the GET request.
     */
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {
        if (authenticationHandler.isUserLoggedIn()) {
            // Stay on home page
        } else {
            // Redirect to landing page to login
        }
    }

}

